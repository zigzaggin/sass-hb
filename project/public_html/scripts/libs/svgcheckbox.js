$(document).ready(function () {
    if (document.createElement('svg').getAttributeNS) {

        var checkbxsCross = Array.prototype.slice.call(document.querySelectorAll('.todo input[type="checkbox"]')),
                pathDefs = {
                    cross: ['M 10 10 L 90 90', 'M 90 10 L 10 90'], },
                animDefs = {
                    cross: {speed: .2, easing: 'ease-in-out'},
                };

        function createSVGEl(def) {
            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            if (def) {
                svg.setAttributeNS(null, 'viewBox', def.viewBox);
                svg.setAttributeNS(null, 'preserveAspectRatio', def.preserveAspectRatio);
            }
            else {
                svg.setAttributeNS(null, 'viewBox', '0 0 100 100');
            }
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            return svg;
        }

        function controlCheckbox(el, type, svgDef) {
            $("body").on("change", "input[type='checkbox']", function () {
                var svg = createSVGEl(svgDef);
                reset($(this));
                $(this).parent().append(svg);
                if ($(this).is(":checked")) {
                    draw($(this), type);
                }
                else {
                    reset($(this));
                }
            });
        }
        checkbxsCross.forEach(function (el, i) {
            controlCheckbox(el, 'cross');
        });

        function draw(el, type) {
            var paths = [], pathDef,
                    animDef,
                    svg = el.parent().find('svg');

            switch (type) {
                case 'cross':
                    pathDef = pathDefs.cross;
                    animDef = animDefs.cross;
                    break;
            }

            paths.push(document.createElementNS('http://www.w3.org/2000/svg', 'path'));

            if (type === 'cross') {
                paths.push(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
            }

            for (var i = 0, len = paths.length; i < len; ++i) {
                var path = paths[i];
                svg.append(path);

                path.setAttributeNS(null, 'd', pathDef[i]);

                var length = path.getTotalLength();
                // Clear any previous transition
                //path.style.transition = path.style.WebkitTransition = path.style.MozTransition = 'none';
                // Set up the starting positions
                path.style.strokeDasharray = length + ' ' + length;
                if (i === 0) {
                    path.style.strokeDashoffset = Math.floor(length) - 1;
                }
                else
                    path.style.strokeDashoffset = length;
                // Trigger a layout so styles are calculated & the browser
                // picks up the starting position before animating
                path.getBoundingClientRect();
                // Define our transition             path.style.transition = path.style.WebkitTransition = path.style.MozTransition = 'stroke-dashoffset ' + animDef.speed + 's ' + animDef.easing + ' ' + i * animDef.speed + 's';
                // Go!
                path.style.strokeDashoffset = '0';
            }
        }

        function reset(el) {
            $(el).parent().find('svg').remove();
        }
    }
});