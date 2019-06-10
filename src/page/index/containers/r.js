

/**
 * 首次render，创建fiber链表，实例化组件，updater属性赋值
 * 
 */

var classComponentUpdater = {
    enqueueSetState: function (inst, payload, callback) {
        var fiber = get(inst);
        var update = createUpdate();
        update.payload = payload;
        update.callback = callback;

        enqueueUpdate(fiber, update);
        scheduleWork(fiber);
    }
}

function Component(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.setState = function (partialState, callback) {
    this.updater.enqueueSetState(this, partialState, callback, 'setState');
}

function updateClassComponent(current$$1, workInProgress, Component, nextProps, renderExpirationTime) {
    var shouldUpdate = void 0;
    constructClassInstance(workInProgress, Component, nextProps, renderExpirationTime);
    mountClassInstance(workInProgress, Component, nextProps, renderExpirationTime);
    shouldUpdate = true;
    var nextUnitOfWork = finishClassComponent(current$$1, workInProgress, Component, shouldUpdate, hasContext, renderExpirationTime);
    return nextUnitOfWork;
}

function constructClassInstance(workInProgress, ctor, props, renderExpirationTime) {
    var instance = new ctor(props, context);
    workInProgress.memoizedState = instance.state !== null && instance.state !== undefined ? instance.state : null;
    instance.updater = classComponentUpdater;
    return instance;
}








/**
 * setState操作调用栈分析
 * 1. 构建出updateQueue对象，类似迭代器
 * firstUpdate
 * lastUpdate
 * next
 *
 */
function enqueueUpdate(fiber, update) {
    var queue1 = void 0;
    queue1 = fiber.updateQueue;
    if (queue1 === null) {
        queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
    }
    appendUpdateToQueue(queue1, update);
}

function appendUpdateToQueue(queue, update) {
    if (queue.lastUpdate === null) {
        // Queue is empty
        queue.firstUpdate = queue.lastUpdate = update;
    } else {
        queue.lastUpdate.next = update;
        queue.lastUpdate = update;
    }
}





/**
 * setState操作调用栈分析
 * 调用scheduleWork
 * 调用requestWork
 * 调用performWork
 *
 */
function scheduleWork(fiber) {
    var root = scheduleWorkToRoot(fiber);
    requestWork(root, rootExpirationTime);
}

function requestWork(root) {
    if (isRendering) {
        return;
    }

    if (isBatchingUpdates) {
        return;
    }

    performSyncWork();
}

function performSyncWork() {
    performWork();
}


function performWork() {
    performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime, false);
}



/**
 * setState操作调用栈分析
 * update渲染
 * renderRoot && commitRoot
 *
 */
function performWorkOnRoot(root) {
    isRendering = true;

    root.finishedWork = null;
    renderRoot(root);
    finishedWork = root.finishedWork;
    if (finishedWork !== null) {
        // Commit the root.
        root.finishedWork = null;
        commitRoot(root, finishedWork);
    }

    isRendering = false;
}


function renderRoot(root) {
    isWorking = true;
    workLoop();
    isWorking = false;
    root.finishedWork = root.current.alternate;
}


function workLoop() {
    // workLoop会一直递归查找整个Fiber树的每一个Fiber节点的变化
    while (nextUnitOfWork !== null) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
}


function performUnitOfWork(workInProgress) {
    var current$$1 = workInProgress.alternate;
    var next = void 0;

    next = beginWork(current$$1, workInProgress);
    workInProgress.memoizedProps = workInProgress.pendingProps;

    if (next === null) {
        next = completeUnitOfWork(workInProgress);
    }

    return next;
}

function beginWork(current$$1) {
    switch (workInProgress.tag) {
        case ClassComponent:
            {
                var _Component2 = workInProgress.type;
                var _unresolvedProps = workInProgress.pendingProps;
                var _resolvedProps = workInProgress.elementType === _Component2 ? _unresolvedProps : resolveDefaultProps(_Component2, _unresolvedProps);
                return updateClassComponent(current$$1, workInProgress, _Component2, _resolvedProps, renderExpirationTime);
            }
    }
}


function updateClassComponent(current$$1) {
    var shouldUpdate = void 0;
    shouldUpdate = updateClassInstance(current$$1, workInProgress, Component, nextProps, renderExpirationTime);

    var nextUnitOfWork = finishClassComponent(current$$1, workInProgress, Component, shouldUpdate, hasContext, renderExpirationTime);
    return nextUnitOfWork;
}

// Invokes the update life-cycles and returns false if it shouldn't rerender.
function updateClassInstance(current, workInProgress, ctor, newProps, renderExpirationTime) {
    var instance = workInProgress.stateNode;

    var oldProps = workInProgress.memoizedProps;
    instance.props = workInProgress.type === workInProgress.elementType ? oldProps : resolveDefaultProps(workInProgress.type, oldProps);
    if ((typeof instance.UNSAFE_componentWillReceiveProps === 'function' || typeof instance.componentWillReceiveProps === 'function')) {
        if (oldProps !== newProps || oldContext !== nextContext) {
            callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext);
        }
    }

    var oldState = workInProgress.memoizedState;
    var newState = instance.state = oldState;
    var updateQueue = workInProgress.updateQueue;
    if (updateQueue !== null) {
        processUpdateQueue(workInProgress, updateQueue, newProps, instance, renderExpirationTime);
        newState = workInProgress.memoizedState;
    }

    if (oldProps === newProps && oldState === newState && !hasContextChanged() && !checkHasForceUpdateAfterProcessing()) {
        if (typeof instance.componentDidMount === 'function') {
            workInProgress.effectTag |= Update;
        }
        return false;
    }

    var shouldUpdate = checkHasForceUpdateAfterProcessing() || checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext);

    if (shouldUpdate) {
        if ((typeof instance.UNSAFE_componentWillUpdate === 'function' || typeof instance.componentWillUpdate === 'function')) {
            if (typeof instance.componentWillUpdate === 'function') {
                instance.componentWillUpdate(newProps, newState, nextContext);
            }
            if (typeof instance.UNSAFE_componentWillUpdate === 'function') {
                instance.UNSAFE_componentWillUpdate(newProps, newState, nextContext);
            }
        }
        if (typeof instance.componentDidUpdate === 'function') {
            workInProgress.effectTag |= Update;
        }
        if (typeof instance.getSnapshotBeforeUpdate === 'function') {
            workInProgress.effectTag |= Snapshot;
        }
    } else {
        // If an update was already in progress, we should schedule an Update
        // effect even though we're bailing out, so that cWU/cDU are called.
        if (typeof instance.componentDidUpdate === 'function') {
            if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
                workInProgress.effectTag |= Update;
            }
        }
        if (typeof instance.getSnapshotBeforeUpdate === 'function') {
            if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
                workInProgress.effectTag |= Snapshot;
            }
        }

        // If shouldComponentUpdate returned false, we should still update the
        // memoized props/state to indicate that this work can be reused.
        workInProgress.memoizedProps = newProps;
        workInProgress.memoizedState = newState;
    }

    // Update the existing instance's state, props, and context pointers even
    // if shouldComponentUpdate returns false.
    instance.props = newProps;
    instance.state = newState;

    return shouldUpdate;
}

function processUpdateQueue(workInProgress, queue, props, instance) {
    var update = queue.firstUpdate;
    var resultState = queue.baseState;

    while (update !== null) {
        resultState = getStateFromUpdate(workInProgress, queue, update, resultState, props, instance);
        var _callback = update.callback;
        if (_callback !== null) {
            update.nextEffect = null;
            if (queue.lastEffect === null) {
                queue.firstEffect = queue.lastEffect = update;
            } else {
                queue.lastEffect.nextEffect = update;
                queue.lastEffect = update;
            }
        }
        update = update.next;
        
    }

    newBaseState = resultState;
    queue.firstUpdate = null;
    queue.lastUpdate = null;
    queue.baseState = newBaseState;
    workInProgress.memoizedState = resultState;
}

function getStateFromUpdate(workInProgress, queue, update, prevState, nextProps, instance) {
    var _payload2 = update.payload;
    var partialState = void 0;
    if (typeof _payload2 === 'function') {
        partialState = _payload2.call(instance, prevState, nextProps);
    } else {
        // Partial state object
        partialState = _payload2;
    }
    if (partialState === null || partialState === undefined) {
        // Null and undefined are treated as no-ops.
        return prevState;
    }
    // Merge the partial state and the previous state.
    return _assign({}, prevState, partialState);
}

function checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext) {
    var instance = workInProgress.stateNode;
    if (typeof instance.shouldComponentUpdate === 'function') {
        var shouldUpdate = instance.shouldComponentUpdate(newProps, newState, nextContext);
        return shouldUpdate;
    }

    if (ctor.prototype && ctor.prototype.isPureReactComponent) {
        return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState);
    }
    return true;
}



function finishClassComponent(current$$1, workInProgress) {
    var instance = workInProgress.stateNode;

    // Rerender
    ReactCurrentOwner$3.current = workInProgress;
    var nextChildren = void 0;
    nextChildren = instance.render();

    // 将实例化后的reactElement转换为Fiber节点保存到当前Fiber节点的child属性中
    workInProgress.child = reconcileChildFibers(workInProgress, current$$1.child, nextChildren);

    return workInProgress.child;
}


/**
 * 生成dom
 * 调用生命周期方法
 * 
 */
function commitRoot(root, finishedWork) {
    isWorking = true;
    isCommitting$1 = true;

    var firstEffect = finishedWork.firstEffect;
    
    nextEffect = firstEffect;
    while (nextEffect !== null) {
        // 更新dom
        invokeGuardedCallback(null, commitAllHostEffects, null);
    }

    root.current = finishedWork;

    nextEffect = firstEffect;
    while (nextEffect !== null) {
        // commitAllLifeCycles 内部执行生命周期方法后调用setState回调：commitUpdateQueue方法
        invokeGuardedCallback(null, commitAllLifeCycles, null, root, committedExpirationTime);
    }

    isCommitting$1 = false;
    isWorking = false;

    onCommitRoot(finishedWork.stateNode);
    onCommit(root, earliestRemainingTimeAfterCommit);
}






function queue(queue, update) {
    if (queue.lastUpdate === null) {
        queue.firstUpdate = queue.lastUpdate = update;
    } else {
        queue.lastUpdate.next = update;
        queue.lastUpdate = update;
    }
}

var init = {
    firstUpdate: null,
    lastUpdate: null,
}
queue(init, {
    payload: {
        count: 1
    }
})

queue(init, {
    payload: {
        count: 2
    }
})


queue(init, {
    payload: {
        count: 3
    }
})
