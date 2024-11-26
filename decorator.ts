// 装饰器笔记：

// 需要把tsconfig 配置 "experimentalDecorators": true,   实验装饰器打开

// 一 、简介
// 1.装饰器本质是一种特殊的函数，它可以对：类、属性、方法、参数进行扩展，同时能让代码更简洁。
// 2.装饰器自2015年在ECMAScript-6中被提出到现在，已将近10年。
// 3.截止目前，装饰器依然是实验性特性，需要开发者手动调整配置，来开启装饰器支持。
// 4.装饰器有5种：
//     1类装饰器
//     2属性装饰器
//     3方法装饰器
//     4访问器装饰器
//     5参数装饰器
// 备注：虽然TypeScript5.0中可以直接使用类装饰器，但为了确保其他装饰器可用，现阶段使用时，
// 仍建议使用experimentalDecorators配置来开启装饰器支持，而且不排除在来的版本中，官方会进一
// 步调整装饰器的相关语法

console.log('-------------------------二、类装饰器-------------------------');

// 二、类装饰器
// 1.基本语法
// 类装饰器是一个应用在类声明上的函数，可以为类添加额外的功能，或添加额外的逻辑。
// 基本语法:
// Demo函数会在Person类定义时执行
// target参数是被装饰的类，即：Person
function Demo(target:Function){ //需要参数
    // console.log(target,'target')
}
@Demo//使用装饰器 @Demo
class Person1 {
    constructor(name:string, age:number){}
}

// 2 应用需求：定义一个装饰器，实现Person实例调用toString时返回JsoN.stringify的执行结果。
function CustomToString(target:Function){
    target.prototype.toString = function(){
        return JSON.stringify(this)//为什么是this不是target? 因为我们不是给Person2这个类 而是给 p 实例化后的对象
    }
    //封闭其原型对象，禁止随意操作其原型对象  不让扩展
    // Object.seal(target.prototype)//TypeError: Cannot add property x, object is not extensible
}
@CustomToString // 注释掉查看控制台
class Person2 {
    constructor(public name:string,public age:number){}
}
const p=new Person2('张三',18)
// console.log(p.toString());
// @ts-ignore 忽略这一行
Person2.prototype.x = 99

// 3 关于返回值
// 类装饰器有返回值：若类装饰器返回一个新的类，那这个新类将替换掉被装饰的类。
// 类装饰器无返回值：若类装饰器无返回值或返回undefined，那被装饰的类不会被替换。
function demo1(target:Function){
    return class {
        test(){
            console.log(200)
            console.log(300)
            console.log(400)
        }
    }
}
//装饰器有返回值时，该返回值会替换掉被装饰的类
@demo1//注释掉 查看打印效果
class Person3 {
    test(){
        console.log(100)
    }
}
// console.log(Person3)

// 4.关于构造类型
// 在TypeScript中，Function类型所表示的范围十分广泛，包括：普通函数、箭头函数、方法等等。
// 但并非Function类型的函数都可以被new关键字实例化，例如箭头函数是不能被实例化的，那么
// TypeScript中概如何声明一个构造类型呢？有以下两种方式：

// 第一种：仅声明构造类型
// 需求：fn 必须是类 但是ts没有提供关于类的类型，所以需要我们去 自定义类型

// new      表示：该类型是可以用new操作符调用
// ...args  表示：构造器可以接受【任意数量】的参数
// any[]    表示：构造器可以接受【任意类型】的参数。
// {}       表示：返回类型是对象（非null、非undefined的对象）。

type Constructor = new (...args:any[])=>{}//构造类型
function test(fn:Constructor) {} //使用自定义类型Constructor 就不用Function了
class Person4 {}//当fn 类型是 Function 时 这里也可以用 let Person4=()=>{}
test(Person4)

// 第二种：仅声明构造类型 + 指定静态属性
type Constructor2 = {
    new (...args:any[]):{}//构造签名
    wife:string
}
// function test(fn:Constructor) {}
class Person5 {
    static wife = 'a' //只是为了加个静态类型， 这是一种兼容写法
}
test(Person5)

// 5.替换被装饰的类
// 对于高级一些的装饰器，不仅仅是覆盖一个原型上的方法，还要有更多功能，例如添加新的方法和状态。
// 需求：设计一个LogTime装饰器，可以给实例添加一个属性，用于记录实例对象的创建时间，再添加一个方法用于读取创建时间。



type Constructor3 = new (...args: any[]) => {}
interface Person6 {//必须是一致的名字 这是interface 具有的合并性
    getTime():void
}

function LogTime<T extends Constructor3>(target: T){ // 泛型约束
    return class extends target{
        createdTime:Date
        constructor(...args:any[]){
            super(...args)
            this.createdTime = new Date()
        }
        getTime(){
            return `该对象的创建时间是：${this.createdTime}`
        }
    }
}
@LogTime
class Person6{
    constructor(public name:string,public age:number){}
}
const p3 =new Person6('张三',18)
// console.log(p3);
// console.log(p3.getTime());

console.log('-------------------------三、装饰器工厂-------------------------');

// 三、装饰器工厂
// 装饰器工厂是一个返回装饰器函数的函数，可以为装饰器添加参数，可以更灵活地控制装饰器的行为。
// 需求：定义一个LogInfo类装饰器工厂，实实Person实例可以调用到introduce方法，且introduce中输出内容的次数，由LogInfo接收的参数决定。

interface Person7 {
    introduce():void
}
// 这个叫装饰器工厂
function LogInfo(n:number){
    // 里面return的才是装饰器 所以说白了装饰器工厂就是函数里面return 了一个函数 / 装饰器
    return function(target:Function) {
        target.prototype.introduce = function(){
            for(let i = 0; i < n ; i++){
                // console.log(`我的名字是：${this.name}，我的年龄是：${this.age}`);
            }
        }
    }
}
// @LogInfo(4)(target) 原理
@LogInfo(4)//更改数字查看打印内容
class Person7{
    constructor(public name:string,public age:number){}
}
const p4 =new Person7('张三',18)
p4.introduce()

console.log('-------------------------四、装饰器组合-------------------------');

// 四、装饰器组合
// 装饰器可以组合使用，执行顺序为：先【由上到下】的执行所有的装饰器工厂，依次获取到装饰器，然后再【由下到上】执行所有的装饰器。
// 装饰器组合——执行顺序
//装饰器
function test1(target:Function){
    console.log('test1')
}
//装饰器工厂
function test2() {
    console.log('test2工厂')
    return function (target:Function){
        console.log('test2')
    }
}
//装饰器工厂
function test3(){
    console.log('test3工厂')
    return function (target:Function){
        console.log('test3')
    }
}
//装饰器
function test4(target:Function){
    console.log('test4')
}

@test1
@test2()
@test3()
@test4
class Person8 {}
// 应用：只是提供大概意思 重要的是要明白 复用的价值
// @CustomString
// @LogInfo(5)
// @LogTime
// class Person{} 我就拥有了上面装饰器提供或修改后的功能了

console.log('-------------------------五、属性装饰器-------------------------');

// 五、属性装饰器 之前都是类装饰器

// 参数说明：
// target：对于静态属性来说值是类，对于实例属性来说值是类的原型对象
// propertyKey：属性名

function Demo2(target:object,propertyKey:string){
    console.log(target,propertyKey);
}

class Person9{
    @Demo2 name: string;
    @Demo2 age: number;
    @Demo2 static school:string//打印的是当前类
    constructor(name: string,age: number) {
        this.name=name
        this.age=age
    }
}
console.log('-------------------------属性遮蔽问题-------------------------');

// 属性遮蔽问题
// 观察 new Person10('张三',18) 前后 修改原型对象 查看 237 打印的 实例对象上的age值 和 原型上的age值
class Person10{
    name: string;
    age: number;
    constructor(name: string,age: number) {
        this.name=name
        this.age=age
    }
}
// let p5= new Person10('张三',18)  
let value =130
Object.defineProperty(Person10.prototype,'age',{
    get(){
        return value
    },
    set(newValue){
        value = newValue
    },
})
let p5=new Person10('张三',18)  

console.log(p5);

//为什么 只是换一下 Object.defineProperty 和 let p5=new Person10('张三',18) 出现的位置 打印的结果就变了呢？
// 实例化在前面时（打开 225 注释掉 235）：
    // 实例化new关键字会调用构造器（当有age属性时变修改，没有时便添加）发现原型上也没有age属性 于是在实例对象上新增age属性值为 18 
    // 然后在为 Person10 的原型上添加属性age 于是打开ProtoType 上查看 age为 130 （此时原型对象和实例对象的age属性 互不干扰）
// 当实例化在后面时：
    // 会为 Person10 的原型上添加属性 age 此时 Person10的原型属性age 值为 18
    // 然后 实例化时调用构造器（当有age属性时变修改，没有时便添加），但是!!! , 当构造器发现实例化并没有 age 时，
    // 此时并不会 立即生成实例化的age属性 ，而是会通过原型链向上寻找，发现 原型上有age ，
    // 所以便修改原型和实例上的age 都为 18，这就是属性遮蔽问题 （此时原型对象和实例对象用的是同一个 age，属于是原型对象上的，实例对象通过作用域链调用到的）

function State(target:object,propertyKey: string){
    let key = `_${propertyKey}`
    // let key:any //张三李四 都用这一个值 来缓存
    Object.defineProperty(target,propertyKey,{
        get(){
            return this[key]
            // return key
        },
        set(newValue){
            // 这里可以收集全部的key 然后批量更新全部key 达到响应式的目地
            console.log(`${propertyKey}的最新值为：${newValue}`);
            this[key] = newValue
            // key = newValue
        },
        enumerable: true,//可枚举性 可不可遍历
        configurable: true,//可配置性 可不可删除
    })
}

class Person11{
    name: string;
    @State age: number;
    constructor(name: string,age: number) {
        this.name=name
        this.age=age
    }
}

let p6=new Person11('张三',18)
let p7=new Person11('李四',28)

p6.age=30
p7.age=40

console.log(p6);
console.log(p7);

console.log('-------------------------六、方法装饰器-------------------------');

// 六、方法装饰器

// 参数说明：
// target：对于静态方法来说值是类，对于实例方法来说值是原型对象。
// propertyKey：方法的名称。
// descriptor：方法的描述对象，其中value属性是被装饰的方法。

// 基本应用
function Demo3(target:object,propertyKey:string,descriptor:PropertyDescriptor){
    // console.log(target);
    // console.log(propertyKey);
    // console.log(descriptor);
}

class Person12{
    constructor(public name: string,public age: number) {}
    @Demo3
    speak(){
        console.log(`你好我的名字：${this.name}我的年龄${this.age}`);
    }
    @Demo3
    static isAdult(age:number){
        return age>=18
    }
}

// 应用举例

function Logger(target:object,propertyKey:string,descriptor:PropertyDescriptor){
    // 存储原始方法
    const origin = descriptor.value
    console.log(origin);//origin是一个新的speak方法，只是名字一样
    
    // 替换原始方法  准确来说是重构原始方法
    descriptor.value= function(...args:any[]){
        // console.log(this);//Person13的实例对象 p8 
        // console.log(args);
        // console.log(`${propertyKey}开始了`);
        // 执行原始函数
        const result = origin.call(this,...args)
        //对于上面一行的代码，我的理解是：
        // 我新写了一个函数体，这个函数里的this指向的是p8
        // 而origin（不是Person13里的speak，而是新的speak独立函数）由于新的speak独立函数被调用，
        // 他的this指向的不是Person13或Person13的实例，而是window，
        // 所以需要通过call将 新的指向 设置为 p8的this 这样新的speak新函数才会正常执行
        // console.log(`${propertyKey}结束了`);
        return result //保证方法的返回值功能可以继续实现
    }
}

function Validate(maxValue:number){
    return function (target:object,propertyKey:string,descriptor:PropertyDescriptor){
        // 保存原始方法
        const original = descriptor.value;
        //替换原始方法
        descriptor.value =function (...args:any[]){
            console.log(args,'1');
            //自定义的验证逻辑
            if(args[0]>maxValue){
                throw new Error('年龄非法！')
                //如果所有参数都符合要求，则调用原始方法
            }
            return original.apply(this,args);
        }
    }
}

class Person13{
    constructor(public name: string,public age: number) {}
    @Logger
    speak(str:string):string{
        console.log(`你好我的名字：${this.name}我的年龄${this.age}---${str}`);
        return '我是返回值'
    }
    @Validate(120)
    static isAdult(age:number){
        console.log(age,'2');
        return age>=18
    }
}

const p8= new Person13('张三',18)
p8.speak('hello') 
// console.log(p8.speak(''));//返回值

console.log(Person13.isAdult(100) );
// console.log(Person13.isAdult(130) );

console.log('-------------------------七、访问器装饰器-------------------------');

// 七、访问器装饰器

function RangeValidate(min:number,max:number){
    return function(target:object,propertyKey:string,descriptor:PropertyDescriptor){
        console.log(descriptor);
        
        //保存原始的setter
        const originalSetter = descriptor.set
        //重写setter
        descriptor.set = function(value:number){
            //检查设置的值是否在指定的最小值和最大值之间
            if (value < min || value > max) {
                //如果值不在范围内，抛出错误
                throw new Error(`${propertyKey}的值应该在 ${min} 到 ${max}之间`);
            }
            //如果值在范围内，且原始 setter 方法存在，则调用原始 setter 方法
            if (originalSetter) {
                originalSetter.call(this, value);
            }
        }
    }
}
class Weather{
    private _temp: number;
    constructor(_temp: number){
        this._temp=_temp;
    }
    @RangeValidate(-50,50)
    set temp(value){
        this._temp = value;
    }
    get temp(){
    return this._temp;
    }
}

let w1=new Weather(100)
w1.temp=40

console.log('-------------------------八、参数装饰器-------------------------');

// 八、参数装饰器

// 参数说明：
// target:
    // 1.如果修饰的是【实例方法】的参数，target是类的【原型对象】
    // 2.如果修饰的是【静态方法】的参数，target是【类】。
// propertyKey：参数所在的方法的名称。
// parameterIndex：参数在函数参数列表中的索引，从θ开始。

// function Paras(target:any,propertyKey:string,parameterIndex:number){
//     console.log(target);
//     // console.log(propertyKey);
//     // console.log(parameterIndex);
//     let metadataKey = `__log_${propertyKey}_parameters`;
//     console.log(target[propertyKey],'target[metadataKey]');
    
//     let originalMethod  = target[propertyKey]
//     target[`_${propertyKey}`] = function (...args: any[]) {
//         console.log(args,'0000000000000');
        
//         let parametersToLog = target[metadataKey];
//         if (parametersToLog) {
//             // parametersToLog.forEach(index => {
//             //     console.log(`参数 ${index} 的值:`, args[index]);
//             // });
//         }
//         return originalMethod.apply(this, args);
//     };
    
// }

// class PersonLast {
//     constructor(public name:string){}
//     speak(@Paras message1:any, message2:any){
//         console.log(`你好我的名字：${this.name} 信息1:${message1} 信息2:${message2}`);
//     }
// }

// let p9=new PersonLast('张三')
// p9.speak('hello',111)





function logParameter(target: any, propertyKey: string, parameterIndex: number) {
    // 获取方法的元数据
    let metadataKey = `__log_${propertyKey}_parameters`;
    if (Array.isArray(target[metadataKey])) {
        target[metadataKey].push(parameterIndex);
    } else {
        target[metadataKey] = [parameterIndex];
    }

    // 获取原始方法
    let originalMethod = target[propertyKey];

    // 添加一个方法拦截器
    target[propertyKey] = function (...args: any[]): any {
        let parametersToLog = target[metadataKey];
        if (parametersToLog) {
            parametersToLog.forEach((index:any) => {
                console.log(`参数 ${index} 的值:`, args[index]);
            });
        }
        return originalMethod.apply(this, args);
    };
}

class Person99 {
    constructor(public name: string) {}
    greet(@logParameter message: string) {
        console.log(`${this.name} says: ${message}`);
    }
}

const person = new Person99('张三');
person.greet('你好，世界！');

