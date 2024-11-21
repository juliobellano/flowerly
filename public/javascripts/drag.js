function init() {
    const drake = dragula([document.getElementById('flowers'), document.getElementById('dropspot')], {
        copy: true, // Allow copying divs
        accepts: function (el, target) {
            return target !== null; // Allow drops into any container
        }
    });

    drake.on('drop', function (el, target) {
        if (target.id === 'dropspot') {
            target.appendChild(el); // Append to target container
            el.style.position = 'absolute';
            el.style.zIndex = '10'; // Ensure overlapping

            // Adjust position relative to the container
            const rect = target.getBoundingClientRect();
            const x = el.getBoundingClientRect().left - rect.left;
            const y = el.getBoundingClientRect().top - rect.top;

            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
        }
    });
}


