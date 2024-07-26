export class Tool {
    constructor(id, name, icon) {
        this.id = id;
        this.name = name;
        this.icon = icon;
    }

    init() {
        console.log(`${this.name} initialized`);
    }

    render() {
        return `<h2>${this.name}</h2>`;
    }

    attachEventListeners() {
        // To be implemented by child classes
    }
}
