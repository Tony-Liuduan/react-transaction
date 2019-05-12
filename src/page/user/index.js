/** @jsx Ldreact.createElement */
import Ldreact from 'ldreact';
import App from './containers';



Ldreact.render(
    <App name="app"/>,
    document.getElementById('root')
);



/*
React.createElement return
test = {
    $$typeof: Symbol(react.element),
    key: null,
    props: { children: { … } },
    ref: null,
    type: "div",
    _owner: null,
    _store: { validated: false },
    _self: null,
    _source: null,
}
 */