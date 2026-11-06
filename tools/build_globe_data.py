# -*- coding: utf-8 -*-
"""
Build the country dataset for the 3D globe.

Source: Natural Earth 1:110m Admin-0 countries (public domain).
Output: js/worldMapData.js  (rings in lon/lat, ready for canvas rasterising)

Note: the Taiwan feature of Natural Earth is merged into China so the map
keeps a single Chinese geometry, consistent with the app's content policy.
"""

import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(HERE, "ne_110m_admin_0_countries.geojson")
SRC_FINE = os.path.join(HERE, "ne_50m_admin_0_countries.geojson")
SRC_META = os.path.join(HERE, "mledoze_countries.json")
OUT = os.path.join(ROOT, "js", "worldMapData.js")

# Taiwan, Hong Kong and Macao are part of China.
MERGE_INTO = {"TWN": "CHN", "HKG": "CHN", "MAC": "CHN"}
# Antarctica and disputed / uninhabited specks carry no country panel.
DROP = {"ATA", "KAS", "ATC", "IOA", "HMD"}
MIN_RING_POINTS = 4
PRECISION = 2

# Short display names for entries whose Natural Earth name is unwieldy
NAME_OVERRIDE = {
    "USA": ("Hoa Kỳ", "United States"),
    "GBR": ("Anh", "United Kingdom"),
    "PRK": ("Triều Tiên", "North Korea"),
    "ARE": ("UAE", "UAE"),
    "COD": ("CHDC Congo", "DR Congo"),
    "CAF": ("CH Trung Phi", "Central African Rep."),
    "DOM": ("CH Dominica", "Dominican Rep."),
    "GNQ": ("Guinea Xích Đạo", "Eq. Guinea"),
    "VCT": ("St. Vincent & Grenadines", "St. Vincent & Gren."),
    "VGB": ("Quần đảo Virgin (Anh)", "British Virgin Is."),
    "VIR": ("Quần đảo Virgin (Mỹ)", "U.S. Virgin Is."),
    "TCA": ("Turks và Caicos", "Turks and Caicos"),
    "SPM": ("Saint-Pierre và Miquelon", "St. Pierre and Miquelon"),
    "ATF": ("Vùng đất Nam Pháp", "Fr. Southern Lands"),
    "SGS": ("Nam Georgia", "South Georgia"),
    "IOT": ("Lãnh thổ Ấn Độ Dương (Anh)", "Br. Indian Ocean Ter."),
}

CONTINENT_KEY = {
    "Africa": "africa",
    "Asia": "asia",
    "Europe": "europe",
    "North America": "namerica",
    "South America": "samerica",
    "Oceania": "oceania",
    "Antarctica": "antarctica",
    "Seven seas (open ocean)": "oceania",
}


def rings_of(geom):
    if geom["type"] == "Polygon":
        polys = [geom["coordinates"]]
    else:
        polys = geom["coordinates"]
    out = []
    for poly in polys:
        for ring in poly:
            if len(ring) >= MIN_RING_POINTS:
                out.append([[round(x, PRECISION), round(y, PRECISION)] for x, y in ring])
    return out


def iso_of(props):
    iso = props.get("ISO_A3")
    if not iso or iso in ("-99", ""):
        iso = props.get("ADM0_A3")
    return iso


def main():
    features = json.load(open(SRC, encoding="utf-8"))["features"]
    have = {iso_of(f["properties"]) for f in features}

    # Natural Earth 110m omits small states (Singapore, Bahrain, Malta...).
    # Add only the ones it lacks, from the 50m set.
    added = 0
    if os.path.exists(SRC_FINE):
        for f in json.load(open(SRC_FINE, encoding="utf-8"))["features"]:
            iso = iso_of(f["properties"])
            if iso in have or iso in DROP:
                continue
            features.append(f)
            have.add(iso)
            added += 1

    meta = {}
    if os.path.exists(SRC_META):
        for m in json.load(open(SRC_META, encoding="utf-8")):
            meta[m["cca3"]] = m

    countries = {}

    for f in features:
        p = f["properties"]
        iso = iso_of(p)
        if iso in DROP:
            continue

        rings = rings_of(f["geometry"])
        if not rings:
            continue

        rec = countries.get(iso)
        if rec is None:
            rec = {
                "id": iso,
                "name": p.get("NAME") or p.get("NAME_EN"),
                "vi": p.get("NAME_VI") or p.get("NAME"),
                "cont": CONTINENT_KEY.get(p.get("CONTINENT"), "asia"),
                "sub": p.get("SUBREGION") or "",
                "pop": int(p.get("POP_EST") or 0),
                "label": [round(p.get("LABEL_X") or 0, 2), round(p.get("LABEL_Y") or 0, 2)],
                "rings": [],
            }
            countries[iso] = rec
        rec["rings"].extend(rings)

    # Dân số cập nhật cho quốc gia trọng tâm của dự án
    if "VNM" in countries:
        countries["VNM"]["pop"] = 101000000

    for iso, (vi, en) in NAME_OVERRIDE.items():
        if iso in countries:
            countries[iso]["vi"] = vi
            countries[iso]["name"] = en

    # merge Taiwan into China
    for src, dst in MERGE_INTO.items():
        if src in countries and dst in countries:
            countries[dst]["rings"].extend(countries[src]["rings"])
            del countries[src]

    # bbox per country (from all rings)
    for rec in countries.values():
        xs = [pt[0] for ring in rec["rings"] for pt in ring]
        ys = [pt[1] for ring in rec["rings"] for pt in ring]
        rec["bbox"] = [round(min(xs), 2), round(min(ys), 2), round(max(xs), 2), round(max(ys), 2)]

        m = meta.get(rec["id"], {})
        caps = m.get("capital") or []
        rec["cap"] = caps[0] if caps else ""
        cur = m.get("currencies") or {}
        if cur:
            code = list(cur.keys())[0]
            rec["cur"] = [code, (cur[code].get("name") or "").split(";")[0]]
        else:
            rec["cur"] = ["", ""]
        langs = m.get("languages") or {}
        rec["lang"] = ", ".join(list(langs.values())[:2])

    out = sorted(countries.values(), key=lambda r: -r["pop"])
    payload = {"countries": out}

    js = (
        "/* Auto-generated by tools/build_globe_data.py - do not edit by hand.\n"
        "   Natural Earth 1:110m Admin-0 (public domain). Rings are [lon, lat]. */\n"
        "window.WORLD_MAP_DATA = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n"
    )
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(js)

    print(f"countries={len(out)} file_kb={len(js)/1024:.1f} points={sum(len(r['rings']) for r in out)}")


if __name__ == "__main__":
    main()
