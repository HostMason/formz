const pages = {
    landing: document.getElementById('landing-page'),
    formBuilder: document.getElementById('form-builder'),
    help: document.getElementById('help-page'),
    customFields: createPage('custom-fields', 'Custom Fields'),
    templates: createPage('templates', 'Templates'),
    settings: createPage('settings', 'Settings')
};

function createPage(id, title) {
    const page = document.createElement('div');
    page.id = id;
    page.style.display = 'none';
    page.innerHTML = `<h1>${title}</h1><p>This is the ${title} page.</p>`;
    document.querySelector('.main-content').appendChild(page);
    return page;
}

function showPage(pageId) {
    Object.values(pages).forEach(page => page.style.display = 'none');
    pages[pageId].style.display = 'block';
}

export { pages, showPage };
