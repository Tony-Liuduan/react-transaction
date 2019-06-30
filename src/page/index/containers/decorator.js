/**
 * 
 * @description 装饰器 
 * 注意，装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，装饰器能在编译阶段运行代码。也就是说，装饰器本质就是编译时执行的函数。 
 * 装饰器只能用于类和类的方法，不能用于函数，因为存在函数提升
 */

/* ********* 1. 给类添加静态属性 ***********  */
/* function testable(isTestable) {
    return function (target) {
        target.isTestable = isTestable;
    }
}

@testable(true)
class MyTestableClass { }
MyTestableClass.isTestable // true

@testable(false)
class MyClass { }
MyClass.isTestable // false

console.log(MyTestableClass.isTestable);
console.log(MyClass.isTestable); */



/* ********* 2. 给类添加实例属性 ***********  */
/* function mixins(...args) {
    console.log(args)
    return function (target) {
        Object.assign(target.prototype, ...args);
    };
}


const Foo = {
    foo() { console.log('foo') }
};

@mixins(Foo, 1, {a: 1})
class MyClass { }

let obj = new MyClass();
obj.foo() */


/* ********* 3. 类方法的装饰 ***********  */
/* class Person {
    @readonly
    name() { return `${this.first} ${this.last}` }
}

function readonly(target, name, descriptor) {
    // descriptor对象原来的值如下
    // {
    //   value: specifiedFunction,
    //   enumerable: false,
    //   configurable: true,
    //   writable: true
    // };
    console.log(target, name, descriptor.value)
    descriptor.writable = false;
    return descriptor;
}

// 上面类似于
// Object.defineProperty(Person.prototype, 'name', descriptor); */



/**
 * 练习：request loading 
 * 
  */


class App {

    @loading(true)
    getData(params = 'csc') {
        console.log('requset start', params);
        return new Promise((res, rej) => {
            setTimeout(() => {
                console.log('end requset')
                res();
            }, 300);
        });
    }
}

function loading(needHide) {
    return function (target, name, descriptor) {
        const raw = descriptor.value;

        descriptor.value = function (...args) {
            console.log(this);
            console.log('loading open...');
            const res = raw.apply(this, args);
            console.log(res);
            if (needHide) {
                res.then(() => {
                    console.log('loading end...');
                })
                
            }
        }
    

        return descriptor;
    }
}

new App().getData('ss')