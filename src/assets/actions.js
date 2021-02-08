Queue.push(()=>{
    let fileCache = {};
    Actions['display-error'] = function() {
        
    };
    Actions['code-viewer-close'] = function() {
        document.body.classList.remove('code-viewer--active');
    };
    Actions['code-viewer-show'] = function(e, options) {
        function LoadIntoPanel() {
            if (eCodeViewer.getAttribute('data-crr-file') === file) {
                document.querySelector('.code-viewer__contents > div.active').classList.remove('active');
            } else {
                eCodeViewer.innerHTML = fileCache[file];
                let linesWithErrors = [];
                [].forEach.call(Parent.getParent('.list-errors').querySelectorAll('.col--line'), item => {
                    linesWithErrors.push(parseInt(item.innerText));
                });
                
                let eCodeViewerLines = document.querySelectorAll('.code-viewer__contents > div'),
                    eAllLines = document.querySelectorAll('.code-viewer__contents > div');

                for (let i = 0, length = linesWithErrors.length; i < length; i++) {
                    eAllLines[linesWithErrors[i] - 1].classList.add('error');
                }
            }

            let eActive = document.querySelectorAll('.code-viewer__contents > div')[line - 1];

            eActive.classList.add('active');
            eActive.scrollIntoView({block:'center'});
        }
        let eCodeViewer = document.querySelector('.code-viewer__contents');
        eCodeViewer.innerHTML = '';
        document.body.classList.add('code-viewer--active');
        if (document.querySelector('.list-errors__line.active') !== null) {
            document.querySelector('.list-errors__line.active').classList.remove('active');
        }
        this.getParent('.list-errors__line').classList.add('active');

        let file    = this.getParent('section').getAttribute('data-file'),
            Parent  = this.getParent('[data-source]'),
            line    = parseInt(Parent.querySelector('.col--line').innerText),
            props   = Parent.getAttribute('data-source').parseProperties(),
            column  = parseInt(props.column);
        if (typeof fileCache[file] === 'undefined') {
            Request(`api/?file=${file}&project=${window.project}`).then(response => {
                fileCache[file] = response;
                LoadIntoPanel();
            });
        } else {
            LoadIntoPanel();
        }
    };
});

document.body.addEventListener('click', function(e, customOptions) {
    var eA = e.target, i;
    customOptions = customOptions || {};
    while (eA !== null && eA !== document.body) {
        if (eA.getAttribute('data-actions') !== null) {
            var type,
                options = eA.getAttribute('data-actions').parseProperties();
            for (i in options) {
                if (typeof i === 'string') {
                    var subOptions = {};
                    if (typeof Actions[i] === 'function') {
                        if (typeof options[i] === 'string') {
                            subOptions = options[i].parseProperties(',');
                        }

                        Actions[i].call(eA, e, subOptions);
                    }
                }
            }
        }

        eA = eA.parentNode;
    }
});