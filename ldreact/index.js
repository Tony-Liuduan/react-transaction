/**
 * 实现一个简版react
 * 
 * 
 */


export const createElement = (type, props, ...children) => {
    props = props || {};
    return { type, props, children };
};


export const render = (vdom, parent = null, root = true) => {
    // 如果有根节点，清空根节点内容
    if (parent && root) parent.textContent = '';
    let mount = parent ? (el => parent.appendChild(el)) : (el => el);

    //console.log(vdom, parent)
    switch (typeof vdom) {
        case 'string':
        case 'number':
            return mount(document.createTextNode(vdom));

        case 'boolean':
            return mount(document.createTextNode(''));

        case 'object':
            if (vdom === null) return mount(document.createTextNode(''));

            // 自定义组件
            if (typeof vdom.type === 'function') return Component.render(vdom, parent);

            if (typeof vdom.type !== 'string') throw new Error(`Invalid VDOM: ${vdom}.`);

            // 创建dom
            const dom = document.createElement(vdom.type);

            // 递归构建dom树
            vdom.children.forEach(child => render(child, dom, false));

            // 挂载dom属性
            for (const prop in vdom.props) setAttribute(dom, prop, vdom.props[prop]);

            return mount(dom);

        default:
            throw new Error(`Invalid VDOM: ${vdom}.`);

    }

};


const setAttribute = (dom, key, value) => {

    if (typeof value == 'function' && key.startsWith('on')) {
        // 事件属性处理
        const eventType = key.slice(2).toLocaleLowerCase();

        // 先移除事件
        dom.__ldractHandlers = dom.__ldractHandlers || {};
        dom.removeEventListener(eventType, dom.__ldractHandlers[eventType]);

        // 再监听事件
        dom.__ldractHandlers[eventType] = value;
        dom.addEventListener(eventType, dom.__ldractHandlers[eventType]);

    } else if (['checked', 'value', 'htmlFor', 'className'].indexOf(key) > -1) {
        // 设置dom.出来的属性
        dom[key] = value;

    } else if (key == 'style' && typeof value == 'object') {

        Object.assign(dom.style, value);

    } else if (key == 'ref' && typeof value == 'function') {

        value(dom);

    } else if (key == 'key') {

        dom.__ldreactKey = value;

    } else if (typeof value != 'object' && typeof value != 'function') {

        dom.setAttribute(key, value);

    }
};

// diff 算法
/* const patch = (dom, vdom, parent = dom.parentNode) => {
    const replace = parent ? el => (parent.replaceChild(el, dom) && el) : (el => el);
    if (typeof vdom == 'object' && typeof vdom.type == 'function') {
        return Component.patch(dom, vdom, parent);

    } else if (typeof vdom != 'object' && dom instanceof Text) {
        return dom.textContent != vdom ? replace(render(vdom, parent)) : dom;

    } else if (typeof vdom == 'object' && dom instanceof Text) {

        return replace(render(vdom, parent));
    } else if (typeof vdom == 'object' && dom.nodeName != vdom.type.toUpperCase()) {

        return replace(render(vdom, parent));
    } else if (typeof vdom == 'object' && dom.nodeName == vdom.type.toUpperCase()) {

        const pool = {};
        const active = document.activeElement;
        [].concat(...dom.childNodes).map((child, index) => {
            const key = child.__gooactKey || `__index_${index}`;
            pool[key] = child;
        });
        [].concat(...vdom.children).map((child, index) => {
            const key = child.props && child.props.key || `__index_${index}`;
            dom.appendChild(pool[key] ? patch(pool[key], child) : render(child, dom));
            delete pool[key];
        });
        for (const key in pool) {
            const instance = pool[key].__gooactInstance;
            if (instance) instance.componentWillUnmount();
            pool[key].remove();
        }
        for (const attr of dom.attributes) dom.removeAttribute(attr.name);
        for (const prop in vdom.props) setAttribute(dom, prop, vdom.props[prop]);
        active.focus();
        return dom;
    }
};
 */


export class Component {

    constructor(props) {
        this.props = props || {};
        this.state = null;
    }

    static render(vdom, parent = null) {
        const props = Object.assign({}, vdom.props, { children: vdom.children });

        if (Component.isPrototypeOf(vdom.type)) {
            console.log(parent)
            // 通过类创建的组件
            const instance = new vdom.type(props)

            instance.componentWillMount();
            instance.base = render(instance.render(), parent, false);
            instance.base.__ldreactInstance = instance;
            instance.base.__ldreactKey = vdom.props.key;
            instance.componentDidMount();

            return instance.base;

        } else {
            // 通过方法创建的组件
            return render(vdom.type(props), parent, false);

        }

    }

    /* static patch(dom, vdom, parent = dom.parentNode) {
        const props = Object.assign({}, vdom.props, { children: vdom.children });
        if (dom.__ldreactInstance && dom.__ldreactInstance.constructor == vdom.type) {
            dom.__ldreactInstance.componentWillReceiveProps(props);
            dom.__ldreactInstance.props = props;
            return patch(dom, dom.__ldreactInstance.render(), parent);
        } else if (Component.isPrototypeOf(vdom.type)) {
            const ndom = Component.render(vdom, parent);
            return parent ? (parent.replaceChild(ndom, dom) && ndom) : (ndom);
        } else if (!Component.isPrototypeOf(vdom.type)) {
            return patch(dom, vdom.type(props), parent);
        }
    } */

    setState(next) {
        const compat = (a) => typeof this.state === 'object' && typeof a === 'object';
        if (this.base && this.shouldComponentUpdate(this.props, next)) {
            const prevState = this.state;
            this.componentWillUpdate(this.props, next);
            this.state = compat(next) ? Object.assign({}, this.state, next) : next;
            //patch(this.base, this.render());
            // bug: 如果多层级组件会将其他组件都清空
            this.base = render(this.render(), this.base.parentNode);
            this.componentDidUpdate(this.props, prevState);
        } else {
            this.state = compat(next) ? Object.assign({}, this.state, next) : next;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps != this.props || nextState != this.state;
    }

    componentWillReceiveProps(nextProps) {
        return undefined;
    }

    componentWillUpdate(nextProps, nextState) {
        return undefined;
    }

    componentDidUpdate(prevProps, prevState) {
        return undefined;
    }

    componentWillMount() {
        return undefined;
    }

    componentDidMount() {
        return undefined;
    }

    componentWillUnmount() {
        return undefined;
    }
};




export default {
    createElement,
    render,
    Component
};