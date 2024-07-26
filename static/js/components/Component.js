export default class Component {
    constructor() {}

    render() {
        throw new Error('Component must implement render method');
    }

    afterRender() {
        // Optional method to be implemented by child classes
    }
}
