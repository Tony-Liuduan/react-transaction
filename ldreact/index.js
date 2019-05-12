/**
 * 实现一个简版react
 * 
 * 
 */


const createElement = (type, props, ...children) => {
    props = props || {};
    return { type, props, children };
};



export default {
    createElement
};