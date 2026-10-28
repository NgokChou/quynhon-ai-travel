document.addEventListener('DOMContentLoaded', () => {

    const transportOptions =
        document.querySelectorAll('.transport-option');

    transportOptions.forEach((option) => {

        option.addEventListener('click', () => {

            const selectedOption =
                option.dataset.option;

            console.log(
                `Selected transport: ${selectedOption}`
            );

            /*
             * Chưa chuyển trang.
             * Sau này có thể thêm:
             * - Taxi information
             * - Shuttle schedule
             * - Private transfer booking
             */

            transportOptions.forEach((item) => {
                item.classList.remove('selected');
            });

            option.classList.add('selected');
        });

    });

});