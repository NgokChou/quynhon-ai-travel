# -*- coding: utf-8 -*-
"""
Build the Vietnam 34-province SVG map data for the interactive region map.

Source geometry: GADM 4.1 ( gadm41_VNM_1.json, 63 pre-merger provinces ).
The 63 units are dissolved into the 34 provincial units created by
Resolution 202/2025/QH15 (effective 12 June 2025), then projected with
Web Mercator and simplified for the browser.

Output: js/vietnamMapData.js
"""

import json
import math
import unicodedata

from shapely.geometry import shape, Polygon, MultiPolygon, Point
from shapely.ops import unary_union

import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

SRC = os.path.join(HERE, "gadm41_VNM_1.json")
OUT = os.path.join(ROOT, "js", "vietnamMapData.js")

VIEW_W = 1000.0
PAD = 38.0
SIMPLIFY_TOL = 0.009  # degrees

# ---------------------------------------------------------------------------
# 34 units after Resolution 202/2025/QH15
# id, Vietnamese name, English name, region key, [old GADM province names]
# ---------------------------------------------------------------------------
UNITS = [
    ("ha-noi",       "Hà Nội",         "Hanoi",           "rr", ["Hà Nội"]),
    ("hai-phong",    "Hải Phòng",      "Hai Phong",       "rr", ["Hải Phòng", "Hải Dương"]),
    ("quang-ninh",   "Quảng Ninh",     "Quang Ninh",      "rr", ["Quảng Ninh"]),
    ("bac-ninh",     "Bắc Ninh",       "Bac Ninh",        "rr", ["Bắc Ninh", "Bắc Giang"]),
    ("hung-yen",     "Hưng Yên",       "Hung Yen",        "rr", ["Hưng Yên", "Thái Bình"]),
    ("ninh-binh",    "Ninh Bình",      "Ninh Binh",       "rr", ["Ninh Bình", "Hà Nam", "Nam Định"]),

    ("cao-bang",     "Cao Bằng",       "Cao Bang",        "nm", ["Cao Bằng"]),
    ("dien-bien",    "Điện Biên",      "Dien Bien",       "nm", ["Điện Biên"]),
    ("lai-chau",     "Lai Châu",       "Lai Chau",        "nm", ["Lai Châu"]),
    ("lang-son",     "Lạng Sơn",       "Lang Son",        "nm", ["Lạng Sơn"]),
    ("lao-cai",      "Lào Cai",        "Lao Cai",         "nm", ["Lào Cai", "Yên Bái"]),
    ("son-la",       "Sơn La",         "Son La",          "nm", ["Sơn La"]),
    ("phu-tho",      "Phú Thọ",        "Phu Tho",         "nm", ["Phú Thọ", "Vĩnh Phúc", "Hòa Bình"]),
    ("thai-nguyen",  "Thái Nguyên",    "Thai Nguyen",     "nm", ["Thái Nguyên", "Bắc Kạn"]),
    ("tuyen-quang",  "Tuyên Quang",    "Tuyen Quang",     "nm", ["Tuyên Quang", "Hà Giang"]),

    ("thanh-hoa",    "Thanh Hóa",      "Thanh Hoa",       "btb", ["Thanh Hóa"]),
    ("nghe-an",      "Nghệ An",        "Nghe An",         "btb", ["Nghệ An"]),
    ("ha-tinh",      "Hà Tĩnh",        "Ha Tinh",         "btb", ["Hà Tĩnh"]),
    ("quang-tri",    "Quảng Trị",      "Quang Tri",       "btb", ["Quảng Trị", "Quảng Bình"]),
    ("hue",          "Huế",            "Hue",             "btb", ["Thừa Thiên Huế"]),

    ("da-nang",      "Đà Nẵng",        "Da Nang",         "ntb", ["Đà Nẵng", "Quảng Nam"]),
    ("quang-ngai",   "Quảng Ngãi",     "Quang Ngai",      "ntb", ["Quảng Ngãi", "Kon Tum"]),
    ("khanh-hoa",    "Khánh Hòa",      "Khanh Hoa",       "ntb", ["Khánh Hòa", "Ninh Thuận"]),

    ("gia-lai",      "Gia Lai",        "Gia Lai",         "tn",  ["Gia Lai", "Bình Định"]),
    ("dak-lak",      "Đắk Lắk",        "Dak Lak",         "tn",  ["Đắk Lắk", "Phú Yên"]),
    ("lam-dong",     "Lâm Đồng",       "Lam Dong",        "tn",  ["Lâm Đồng", "Đắk Nông", "Bình Thuận"]),

    ("tp-hcm",       "TP. Hồ Chí Minh", "Ho Chi Minh City", "dnb", ["Hồ Chí Minh", "Bình Dương", "Bà Rịa-Vũng Tàu"]),
    ("dong-nai",     "Đồng Nai",       "Dong Nai",        "dnb", ["Đồng Nai", "Bình Phước"]),
    ("tay-ninh",     "Tây Ninh",       "Tay Ninh",        "dnb", ["Tây Ninh", "Long An"]),

    ("can-tho",      "Cần Thơ",        "Can Tho",         "dbscl", ["Cần Thơ", "Sóc Trăng", "Hậu Giang"]),
    ("an-giang",     "An Giang",       "An Giang",        "dbscl", ["An Giang", "Kiên Giang"]),
    ("dong-thap",    "Đồng Tháp",      "Dong Thap",       "dbscl", ["Đồng Tháp", "Tiền Giang"]),
    ("vinh-long",    "Vĩnh Long",      "Vinh Long",       "dbscl", ["Vĩnh Long", "Bến Tre", "Trà Vinh"]),
    ("ca-mau",       "Cà Mau",         "Ca Mau",          "dbscl", ["Cà Mau", "Bạc Liêu"]),
]


def norm(s: str) -> str:
    s = s.replace("đ", "d").replace("Đ", "D")
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return "".join(c for c in s.lower() if c.isalnum())


def mercator(lng, lat):
    x = math.radians(lng)
    y = -math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))
    return x, y


def to_polygons(geom):
    if isinstance(geom, Polygon):
        return [geom]
    if isinstance(geom, MultiPolygon):
        return list(geom.geoms)
    return [g for g in getattr(geom, "geoms", []) if isinstance(g, (Polygon, MultiPolygon))]


def main():
    data = json.load(open(SRC, encoding="utf-8"))
    by_name = {norm(f["properties"]["NAME_1"]): f for f in data["features"]}

    groups = []
    used = set()
    for uid, vi, en, region, olds in UNITS:
        parts = []
        for old in olds:
            key = norm(old)
            if key not in by_name:
                raise SystemExit(f"missing GADM feature: {old} ({key})")
            used.add(key)
            parts.append(shape(by_name[key]["geometry"]))
        merged = unary_union([p.buffer(0) for p in parts])
        merged = merged.simplify(SIMPLIFY_TOL, preserve_topology=True)
        if merged.is_empty:
            raise SystemExit(f"empty geometry for {vi}")
        groups.append({"id": uid, "vi": vi, "en": en, "region": region, "geom": merged})

    missing = set(by_name) - used
    if missing:
        raise SystemExit(f"GADM features not assigned to any unit: {sorted(missing)}")

    # --- projection --------------------------------------------------------
    pts = []
    for g in groups:
        for poly in to_polygons(g["geom"]):
            for x, y in poly.exterior.coords:
                pts.append(mercator(x, y))

    min_x = min(p[0] for p in pts)
    max_x = max(p[0] for p in pts)
    min_y = min(p[1] for p in pts)
    max_y = max(p[1] for p in pts)

    scale = (VIEW_W - PAD * 2) / (max_x - min_x)
    view_h = round((max_y - min_y) * scale + PAD * 2, 1)

    def project(lng, lat):
        x, y = mercator(lng, lat)
        return (
            round((x - min_x) * scale + PAD, 1),
            round((y - min_y) * scale + PAD, 1),
        )

    def ring_path(coords, min_area=2.0):
        """Build an SVG path for a projected ring; drop specks too small to see."""
        if len(coords) < 4:
            return None
        area = 0.0
        for i in range(len(coords) - 1):
            area += coords[i][0] * coords[i + 1][1] - coords[i + 1][0] * coords[i][1]
        if abs(area) / 2.0 < min_area:
            return None
        return "M" + " ".join(f"{x:.1f},{y:.1f}" for x, y in coords) + "Z"

    # --- path building -----------------------------------------------------
    out_units = []
    for g in groups:
        d_parts = []
        for poly in to_polygons(g["geom"]):
            for ring in [poly.exterior] + list(poly.interiors):
                d = ring_path([project(x, y) for x, y in ring.coords])
                if d:
                    d_parts.append(d)

        # projected largest polygon (for label placement + bbox)
        biggest = max(to_polygons(g["geom"]), key=lambda p: p.area)
        proj_biggest = Polygon([project(x, y) for x, y in biggest.exterior.coords])
        rp = proj_biggest.representative_point()
        b = proj_biggest.bounds

        out_units.append({
            "id": g["id"],
            "vi": g["vi"],
            "en": g["en"],
            "region": g["region"],
            "d": " ".join(d_parts),
            "lx": round(rp.x, 1),
            "ly": round(rp.y, 1),
            "bx": round(b[0], 1),
            "by": round(b[1], 1),
            "bw": round(b[2] - b[0], 1),
            "bh": round(b[3] - b[1], 1),
            "area": round(g["geom"].area, 4),
            "_poly": proj_biggest,
        })

    # rank by area, biggest = 1
    ranked = sorted(out_units, key=lambda u: -u["area"])
    for i, u in enumerate(ranked, 1):
        u["rank"] = i

    # --- greedy label placement -------------------------------------------
    FONT = 27.0
    LH = FONT * 1.42

    # Tên rút gọn dùng khi ước lượng bề rộng nhãn (khớp với LABEL_SHORT bên JS)
    LABEL_OVERRIDE = {"tp-hcm": "TP.HCM"}

    def label_w(text):
        return max(len(text) * FONT * 0.66, FONT * 1.4)

    def box(cx, cy, w, h):
        return (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2)

    def overlap(a, b):
        dx = min(a[2], b[2]) - max(a[0], b[0])
        dy = min(a[3], b[3]) - max(a[1], b[1])
        return max(0.0, dx) * max(0.0, dy)

    placed = []
    for u in ranked:
        poly = u["_poly"]
        w = label_w(LABEL_OVERRIDE.get(u["id"], u["vi"]))
        best = None
        for r in (0, 12, 22, 34, 48, 64, 82, 104, 130, 160):
            for k in range(24):
                ang = k * (2 * math.pi / 24)
                cx = u["lx"] + r * math.cos(ang) * 1.4
                cy = u["ly"] + r * math.sin(ang)
                cand = box(cx, cy, w, LH)
                if cand[0] < 4 or cand[2] > VIEW_W - 4:
                    continue
                ov = sum(overlap(cand, p) for p in placed)
                inside = poly.contains(Point(cx, cy))
                score = ov * 60 + r + (0 if inside else 120)
                if best is None or score < best[0]:
                    best = (score, cx, cy, cand)
        if best is None:
            best = (0, u["lx"], u["ly"], box(u["lx"], u["ly"], w, LH))
        _, cx, cy, cand = best
        placed.append(cand)
        u["lx"] = round(cx, 1)
        u["ly"] = round(cy, 1)

    for u in out_units:
        del u["_poly"]

    # --- country outline (coast + land border) -----------------------------
    country = unary_union([g["geom"] for g in groups]).simplify(SIMPLIFY_TOL, preserve_topology=True)
    outline_parts = []
    for poly in to_polygons(country):
        for ring in [poly.exterior] + list(poly.interiors):
            d = ring_path([project(x, y) for x, y in ring.coords], min_area=3.0)
            if d:
                outline_parts.append(d)

    payload = {
        "viewBox": f"0 0 {VIEW_W:g} {view_h:g}",
        "width": VIEW_W,
        "height": view_h,
        "outline": " ".join(outline_parts),
        "units": out_units,
    }

    js = (
        "/* Auto-generated by tools/build_map_data.py - do not edit by hand.\n"
        "   34 provincial units (Resolution 202/2025/QH15), geometry: GADM 4.1, Web Mercator. */\n"
        "window.VIETNAM_MAP_DATA = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n"
    )
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(js)

    total = sum(len(u["d"]) for u in out_units)
    print(f"units={len(out_units)} viewBox={payload['viewBox']} pathchars={total} file_kb={len(js)/1024:.1f}")


if __name__ == "__main__":
    main()
