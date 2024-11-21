function init() {
    const drake = dragula({
        isContainer: function (el) {
            return el.id === 'spot1' || 
                   el.id === 'spot2' || 
                   el.id === 'spot3' || 
                   el.id === 'spot4';
        },
        copy: true,
        accepts: function (el, target, source) {
            // Limit to only drop in specific spots
            return target.classList.contains('drop-spot') && 
                   target.children.length === 0;
        }
    });

    drake.on('drop', function (el, target) {
        if (target.classList.contains('drop-spot')) {
            // Position the dropped element exactly in the center of the drop spot
            el.style.position = 'absolute';
            el.style.left = '50%';
            el.style.top = '50%';
            el.style.transform = 'translate(-50%, -50%)';
        }
    });
}