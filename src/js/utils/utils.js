// get hash
export const getHash = () => {
    if (location.hash) {
        return location.hash.replace('#', '');
    }
};

// body lock
export let bodyLockStatus = true;
export const bodyLockToggle = (delay = 500) => {
    if (document.documentElement.classList.contains('lock')) {
        bodyUnlock(delay);
    } else {
        bodyLock(delay);
    }
};
export const bodyUnlock = (delay = 500) => {
    if (bodyLockStatus) {
        setTimeout(() => {
            document.documentElement.classList.remove('lock');
        }, delay);
        bodyLockStatus = false;
        setTimeout(function () {
            bodyLockStatus = true;
        }, delay);
    }
};
export const bodyLock = (delay = 500) => {
    if (bodyLockStatus) {
        document.documentElement.classList.add('lock');

        bodyLockStatus = false;
        setTimeout(function () {
            bodyLockStatus = true;
        }, delay);
    }
};

// menu
export const menuInit = () => {
    if (document.querySelector('.hamburger')) {
        const hamburger = document.querySelector('.hamburger');
        hamburger.addEventListener('click', function (e) {
            if (bodyLockStatus) {
                document.documentElement.classList.toggle('_menu-opened');
                bodyLockToggle();
            }
        });
    }
};
export const menuOpen = () => {
    bodyLock();
    document.documentElement.classList.add('_menu-opened');
};
export const menuClose = () => {
    bodyUnlock();
    document.documentElement.classList.remove('_menu-opened');
};

// remove class from all array elements
export const removeClasses = (array, className) => {
    for (var i = 0; i < array.length; i++) {
        array[i].classList.remove(className);
    }
};

// convert rem
export const rem = (rem) => {
    if (window.innerWidth > 768) {
        return 0.005208335 * window.innerWidth * rem;
    } else {
        return (100 / 390) * (0.1 * window.innerWidth) * rem;
    }
};

// smooth slide
export const _slideUp = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = `${target.offsetHeight}px`;
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = showmore ? `${window.innerWidth > 768 ? showmore / 10 : showmore / 5}rem` : `0`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = !showmore ? true : false;
            !showmore ? target.style.removeProperty('height') : null;
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            !showmore ? target.style.removeProperty('overflow') : null;
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
            // create event
            document.dispatchEvent(
                new CustomEvent('slideUpDone', {
                    detail: {
                        target: target
                    }
                })
            );
        }, duration);
    }
};
export const _slideDown = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.hidden = target.hidden ? false : null;
        showmore ? target.style.removeProperty('height') : null;
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = showmore ? `${window.innerWidth > 768 ? showmore / 10 : showmore / 5}rem` : `0`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
            // create event
            document.dispatchEvent(
                new CustomEvent('slideDownDone', {
                    detail: {
                        target: target
                    }
                })
            );
        }, duration);
    }
};
export const _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
};

// array uniqueization
export const uniqueArray = (array) => {
    return array.filter(function (item, index, self) {
        return self.indexOf(item) === index;
    });
};

// processing media requests from attributes
export const dataMediaQueries = (array, dataSetValue) => {
    // get objects with media queries
    const media = Array.from(array).filter(function (item, index, self) {
        if (item.dataset[dataSetValue]) {
            return item.dataset[dataSetValue].split(',')[0];
        }
    });
    // objects with media queries initialization
    if (media.length) {
        const breakpointsArray = [];
        media.forEach((item) => {
            const params = item.dataset[dataSetValue];
            const breakpoint = {};
            const paramsArray = params.split(',');
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        });
        // get unique breakpoints
        let mdQueries = breakpointsArray.map(function (item) {
            return '(' + item.type + '-width: ' + item.value + 'px),' + item.value + ',' + item.type;
        });
        mdQueries = uniqueArray(mdQueries);
        const mdQueriesArray = [];

        if (mdQueries.length) {
            // work with every breakpoint
            mdQueries.forEach((breakpoint) => {
                const paramsArray = breakpoint.split(',');
                const mediaBreakpoint = paramsArray[1];
                const mediaType = paramsArray[2];
                const matchMedia = window.matchMedia(paramsArray[0]);
                // objects with conditions
                const itemsArray = breakpointsArray.filter(function (item) {
                    if (item.value === mediaBreakpoint && item.type === mediaType) {
                        return true;
                    }
                });
                mdQueriesArray.push({
                    itemsArray,
                    matchMedia
                });
            });
            return mdQueriesArray;
        }
    }
};

// accordion
export const accordion = () => {
    const accordionItems = document.querySelectorAll('[data-accordion]');

    if (accordionItems.length) {
        const initAccordion = (accordionItems, matchMedia = false) => {
            accordionItems.forEach((accordionGroup) => {
                accordionGroup = matchMedia ? accordionGroup.item : accordionGroup;
                if (matchMedia.matches || !matchMedia) {
                    accordionGroup.classList.add('_accordion-init');
                    initAccordionBody(accordionGroup);
                    accordionGroup.addEventListener('click', setAccordionActions);
                } else {
                    accordionGroup.classList.remove('_accordion-init');
                    initAccordionBody(accordionGroup, false);
                    accordionGroup.removeEventListener('click', setAccordionActions);
                }
            });
        };
        const initAccordionBody = (accordionGroup, hideAccordionBody = true) => {
            let titles = accordionGroup.querySelectorAll('[data-accordion-item]');
            if (titles.length) {
                titles = Array.from(titles).filter(
                    (item) => item.closest('[data-accordion]') === accordionGroup
                );
                titles.forEach((title) => {
                    if (hideAccordionBody) {
                        title.removeAttribute('tabindex');
                        if (!title.classList.contains('_accordion-active')) {
                            title.nextElementSibling.hidden = true;
                        }
                    } else {
                        title.setAttribute('tabindex', '-1');
                        title.nextElementSibling.hidden = false;
                    }
                });
            }
        };
        const setAccordionActions = (e) => {
            const target = e.target;
            if (target.closest('[data-accordion-item]')) {
                const title = target.closest('[data-accordion-item]');
                const group = title.closest('[data-accordion]');
                const isOneActiveItem = group.hasAttribute('data-accordion-one-active');
                const accordionSpeed = group.dataset.accordionSpeed
                    ? parseInt(group.dataset.accordionSpeed)
                    : 500;

                if (!group.querySelectorAll('._slide').length) {
                    if (isOneActiveItem && !title.classList.contains('_accordion-active')) {
                        hideAccordionBody(group);
                    }
                    title.classList.toggle('_accordion-active');
                    _slideToggle(title.nextElementSibling, accordionSpeed);
                }
                e.preventDefault();
            }
        };
        const hideAccordionBody = (accordionGroup) => {
            const activeTitle = accordionGroup.querySelector('[data-accordion-item]._accordion-active');
            const accordionSpeed = accordionGroup.dataset.accordionSpeed
                ? parseInt(accordionGroup.dataset.accordionSpeed)
                : 500;
            if (activeTitle && !accordionGroup.querySelectorAll('._slide').length) {
                activeTitle.classList.remove('_accordion-active');
                _slideUp(activeTitle.nextElementSibling, accordionSpeed);
            }
        };
        const accordionClose = document.querySelectorAll('[data-accordion-close]');
        if (accordionClose.length) {
            document.addEventListener('click', function (e) {
                const target = e.target;
                if (!target.closest('[data-accordion]')) {
                    accordionClose.forEach((accordionItemClose) => {
                        const group = accordionItemClose.closest('[data-accordion]');
                        const speed = spollersBlock.dataset.accordionSpeed
                            ? parseInt(group.dataset.accordionSpeed)
                            : 500;
                        accordionItemClose.classList.remove('_accordion-active');
                        _slideUp(accordionItemClose.nextElementSibling, speed);
                    });
                }
            });
        }

        const regItems = Array.from(accordionItems).filter(function (item, index, self) {
            return !item.dataset.accordion.split(',')[0];
        });

        // init regular accordion items
        if (regItems.length) {
            initAccordion(regItems);
        }

        // get accordion items with media queries
        const mdQueriesArray = dataMediaQueries(accordionItems, 'accordion');

        if (mdQueriesArray && mdQueriesArray.length) {
            mdQueriesArray.forEach((mdQueriesItem) => {
                // event
                mdQueriesItem.matchMedia.addEventListener('change', function () {
                    initAccordion(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                });
                initAccordion(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            });
        }
    }
};

// array uniqueization
export const uniqArray = (array) => {
    return array.filter(function (item, index, self) {
        return self.indexOf(item) === index;
    });
};

// showmore
export function showmore() {
    const showMoreBlocks = document.querySelectorAll('[data-showmore]');
    let showMoreBlocksRegular;
    let mdQueriesArray;
    if (showMoreBlocks.length) {
        // get regular objects
        showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function (item, index, self) {
            return !item.dataset.showmoreMedia;
        });
        // regular objects initialization
        showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;

        document.addEventListener('click', showMoreActions);
        window.addEventListener('resize', showMoreActions);

        // get objects with media queries
        mdQueriesArray = dataMediaQueries(showMoreBlocks, 'showmoreMedia');
        if (mdQueriesArray && mdQueriesArray.length) {
            mdQueriesArray.forEach((mdQueriesItem) => {
                // event
                mdQueriesItem.matchMedia.addEventListener('change', function () {
                    initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                });
            });
            initItemsMedia(mdQueriesArray);
        }
    }
    function initItemsMedia(mdQueriesArray) {
        mdQueriesArray.forEach((mdQueriesItem) => {
            initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
    }
    function initItems(showMoreBlocks, matchMedia) {
        showMoreBlocks.forEach((showMoreBlock) => {
            initItem(showMoreBlock, matchMedia);
        });
    }
    function initItem(showMoreBlock, matchMedia = false) {
        showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
        let showMoreContent = showMoreBlock.querySelectorAll('[data-showmore-content]');
        let showMoreButton = showMoreBlock.querySelectorAll('[data-showmore-button]');
        showMoreContent = Array.from(showMoreContent).filter(
            (item) => item.closest('[data-showmore]') === showMoreBlock
        )[0];
        showMoreButton = Array.from(showMoreButton).filter(
            (item) => item.closest('[data-showmore]') === showMoreBlock
        )[0];
        const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
        if (matchMedia.matches || !matchMedia) {
            if (hiddenHeight < getOriginalHeight(showMoreContent)) {
                _slideUp(showMoreContent, 0, hiddenHeight);
                showMoreButton.hidden = false;
            } else {
                _slideDown(showMoreContent, 0, hiddenHeight);
                showMoreButton.hidden = true;
            }
        } else {
            _slideDown(showMoreContent, 0, hiddenHeight);
            showMoreButton.hidden = true;
        }
    }
    function getHeight(showMoreBlock, showMoreContent) {
        let hiddenHeight = 0;
        const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : 'size';
        if (showMoreType === 'items') {
            const showMoreTypeValue = showMoreContent.dataset.showmoreContent
                ? showMoreContent.dataset.showmoreContent
                : 3;
            const showMoreItems = showMoreContent.children;
            for (let index = 1; index < showMoreItems.length; index++) {
                const showMoreItem = showMoreItems[index - 1];
                hiddenHeight += showMoreItem.offsetHeight;
                if (index == showMoreTypeValue) break;
            }
        } else {
            const showMoreTypeValue = showMoreContent.dataset.showmoreContent
                ? showMoreContent.dataset.showmoreContent
                : 150;
            hiddenHeight = showMoreTypeValue;
        }
        return hiddenHeight;
    }
    function getOriginalHeight(showMoreContent) {
        let parentHidden;
        let hiddenHeight = showMoreContent.offsetHeight;
        showMoreContent.style.removeProperty('height');
        if (showMoreContent.closest(`[hidden]`)) {
            parentHidden = showMoreContent.closest(`[hidden]`);
            parentHidden.hidden = false;
        }
        let originalHeight = showMoreContent.offsetHeight;
        parentHidden ? (parentHidden.hidden = true) : null;
        showMoreContent.style.height = `${hiddenHeight}px`;
        return originalHeight;
    }
    function showMoreActions(e) {
        const targetEvent = e.target;
        const targetType = e.type;
        if (targetType === 'click') {
            if (targetEvent.closest('[data-showmore-button]')) {
                const showMoreButton = targetEvent.closest('[data-showmore-button]');
                const showMoreBlock = showMoreButton.closest('[data-showmore]');
                const showMoreContent = showMoreBlock.querySelector('[data-showmore-content]');
                const showMoreSpeed = showMoreBlock.dataset.showmoreButton
                    ? showMoreBlock.dataset.showmoreButton
                    : '500';
                const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
                if (!showMoreContent.classList.contains('_slide')) {
                    showMoreBlock.classList.contains('_showmore-active')
                        ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight)
                        : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
                    showMoreBlock.classList.toggle('_showmore-active');
                }
            }
        } else if (targetType === 'resize') {
            showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
            mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
        }
    }
}

// set hash
export const setHash = (hash) => {
    hash = hash ? `#${hash}` : window.location.href.split('#')[0];
    history.pushState('', '', hash);
};

// tabs
export const tabs = () => {
    const tabs = document.querySelectorAll('[data-tabs]');
    let tabsActiveHash = [];

    const init = (tabsBlock) => {
        let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
        let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
        const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
        const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

        console.log(tabsBlock);

        if (tabsActiveHashBlock) {
            const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._active');
            tabsActiveTitle ? tabsActiveTitle.classList.remove('_active') : null;
        }
        if (tabsContent.length) {
            tabsContent = Array.from(tabsContent).filter((item) => item.closest('[data-tabs]') === tabsBlock);
            tabsTitles = Array.from(tabsTitles).filter((item) => item.closest('[data-tabs]') === tabsBlock);
            tabsContent.forEach((tabsContentItem, index) => {
                tabsTitles[index].setAttribute('data-tabs-title', '');
                tabsContentItem.setAttribute('data-tabs-item', '');

                if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
                    tabsTitles[index].classList.add('_active');
                }
                tabsContentItem.hidden = !tabsTitles[index].classList.contains('_active');
            });
        }
    };
    const setStatus = (tabsBlock) => {
        let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
        let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
        const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
        if (tabsContent.length) {
            const isHash = tabsBlock.hasAttribute('data-tabs-hash');
            tabsContent = Array.from(tabsContent).filter((item) => item.closest('[data-tabs]') === tabsBlock);
            tabsTitles = Array.from(tabsTitles).filter((item) => item.closest('[data-tabs]') === tabsBlock);
            tabsContent.forEach((tabsContentItem, index) => {
                if (tabsTitles[index].classList.contains('_active')) {
                    tabsContentItem.hidden = false;
                    if (isHash && !tabsContentItem.closest('.modal')) {
                        setHash(`tab-${tabsBlockIndex}-${index}`);
                    }
                } else {
                    tabsContentItem.hidden = true;
                }
            });
        }
    };
    const setActions = (e) => {
        const target = e.target;
        if (
            (target.closest('[data-tabs-title]') && !document.querySelector('[data-tab-btn]')) ||
            (target.closest('[data-tab-btn]') && document.querySelector('[data-tab-btn]'))
        ) {
            const tabTitle = target.closest('[data-tabs-title]');
            const tabsBlock = tabTitle.closest('[data-tabs]');
            if (!tabTitle.classList.contains('_active') && !tabsBlock.querySelector('._slide')) {
                let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._active');
                tabActiveTitle.length
                    ? (tabActiveTitle = Array.from(tabActiveTitle).filter(
                          (item) => item.closest('[data-tabs]') === tabsBlock
                      ))
                    : null;
                tabActiveTitle.length ? tabActiveTitle[0].classList.remove('_active') : null;
                tabTitle.classList.add('_active');
                setStatus(tabsBlock);
            }
            e.preventDefault();
        }
    };

    if (tabs.length) {
        const hash = getHash();
        if (hash && hash.startsWith('tab-')) {
            tabsActiveHash = hash.replace('tab-', '').split('-');
        }
        tabs.forEach((tabsBlock, index) => {
            tabsBlock.classList.add('_tab-init');
            tabsBlock.setAttribute('data-tabs-index', index);
            tabsBlock.addEventListener('click', setActions);
            init(tabsBlock);
        });
    }
};

// set active class
export const setActiveClass = (event, target, innerTarget, activeClass, isPreventDef) => {
    if (
        document.querySelector(`${target}.${activeClass}`) &&
        (!event.target.closest(`${target}`) || event.target.closest(`${innerTarget}`))
    ) {
        if (isPreventDef) {
            event.preventDefault();
        }
        document.querySelector(`${target}.${activeClass}`).classList.remove(`${activeClass}`);
    } else if (!document.querySelector(`${target}.${activeClass}`) && event.target.closest(`${target}`)) {
        if (isPreventDef) {
            event.preventDefault();
        }
        event.target.closest(`${target}`).classList.add(`${activeClass}`);
    }
};

// replace dom elements
export const dynamicDOM = () => {
    const dynamicElements = document.querySelectorAll('[data-dom-replace]');
    if (dynamicElements.length) {
        dynamicElements.forEach((dynamicElement) => {
            const params = dynamicElement.dataset.domReplace.trim().split(',');
            const parent = dynamicElement.closest(`${params[2]}`);
            const container = dynamicElement.closest(`${params[0]}`);
            const target = parent.querySelector(`${params[1]}`);

            const moveElements = () => {
                if (window.innerWidth <= 768) {
                    target.append(dynamicElement);
                } else {
                    container.append(dynamicElement);
                }
            };
            moveElements();

            window.addEventListener('resize', moveElements);
        });
    }
};
