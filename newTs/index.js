"use strict";
/*
 包括 JavaScript 类型：
 string
 number
 boolean
 null
 undefined
 bigint symbol object（Array 、Function等等） 基本不用

 六个新类型:
 any
 unknown
 never
 void
 tuple
 enum

 ⽤于⾃定义类型的⽅式:
 type
 interface

 interface 和 type 以及 abstract 的区别
*/
/*
any:显式的 隐式的(ts自动推断 没有明确的类型就可能会推断出是any)
any的缺点
注意点：any类型的变量，可以赋值给任意类型的变量
 */
let c;
c = 9;
let x;
x = c; // 不报错 
// unknown：未知类型
// 会强制开发者在使⽤之前进⾏类型检查
// 我们定义一个变量，现在不使用也知道以后是什么类型，所以就用这个
// 等以后有人用到了这个变量，他只需在用这个变量之前添加类型检查就可以了
// 类型检测方法：if判断和断言，整个过程也算是提供了类型安全，所以一般就是unknown+断言
// never：不能有值  
// ⼀般是TypeScript 主动推断出来的  很少用
// 主要应用场景就是 一个函数 抛出错误 返回值类型就是 never
// void: 空！调⽤者不应依赖其返回值进⾏任何操作
// 以void为返回值的函数里 return undefine 没有问题， null 就不行
// undefined 你可以拿这个函数的返回值结果去进行操作，但是void就不行，这也是他们俩之间的区别
// 断言的两种方式：
// a as string  
// <string>a
// Object/object :
// 声明数组类型
let a1; //数组
let a2; //泛型
let a3; // tuple 元祖就是一个特殊的 数组类型 （tuple不是关键字）  // 关键字的定义：string number 可以直接：boolean  这样的就是
let a4; //任意多个string类型值 
// 声明对象类型
let p1; // 对象字面量
let p2; //索引签名  
// 声明函数类型
let fn;
fn = (x, y) => {
    return x + y;
};
// enum 枚举：数字枚举  字符串枚举  常量枚举：
var Fx;
(function (Fx) {
    Fx["Up"] = "2132";
    Fx[Fx["Down"] = 1] = "Down";
    Fx[Fx["Left"] = 2] = "Left";
    Fx[Fx["Right"] = 3] = "Right";
})(Fx || (Fx = {}));
1 /* Fx2.Down */; //可以注释我 
let a;
a = 100;
function fn2(data) { }
fn2(1);
fn2('1');
let b;
let b2;
b = 1;
const house = {
    height: 100,
    width: 100,
    num: 100,
    cell: 100,
    // room:'111' 
};
function demo() {
    return;
}
const f1 = () => 123; //并不会报错 123 number 给 void 是可以的
let obj = {
    name: '张三',
    age: 18,
};
class PersonX {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    speak(n) { }
}
// 接⼝⾃动合并 : 
// ⼀个interface 继承另⼀个interface 从⽽实现代码的复⽤,如果是同样的名字自动合并（这也是和type区别开来的一个特点
//#endregion
// interface 和 type 以及 abstract 的区别 ：
// interface 和 abstract class 都可以用来定义类的结构，但 type 主要用于定义类型别名
// interface ：更专注于定义对象和类的结构，支持继承、合并
// 特点：
// 可以被实现（implements）  自动合并特性是： 两个接口名称一样 接口会自动合并
// 可以被继承（extends）
// 仅在编译时存在，不会生成运行时代码
// 可以多次声明同一个接口，TypeScript 会自动合并这些声明
// abstract class（抽象类） 既可以包含抽象⽅法，也可以包含具体⽅法， ⼀个类只能继承⼀个抽象类
// 用途：定义类的结构，可以包含抽象方法（没有实现的方法）和具体方法
// 特点：
// 不能被实例化，只能被继承
// 可以包含具体实现的方法和属性
// 可以包含构造函数
// 生成运行时代码
// type：可以定义类型别名、联合类型、交叉类型，但不支持继承和自动合并
// 用途：定义新的类型名称，可以是原始类型、联合类型、元组类型等。
// 特点：
// 不能被实现（implements）或继承（extends）。
// 仅在编译时存在，不会生成运行时代码。
// 适用于复杂的类型定义，特别是联合类型和交叉类型
// 类：
// public     公开的     可以被：类内部、⼦类、类外部访问  
// protected  受保护的   受保护的 可以被：类内部、⼦类访问
// private    私有的     可以被：类内部访问
// readonly   只读属性   属性⽆法修改
class Person {
    //构造器
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    //方法
    speak() {
        console.log(`我叫：${this.name},今年s{this.age}岁`);
    }
}
//Person实例
const pl = new Person('周杰伦', 38);
class Student extends Person {
    //构造器
    constructor(name, age, grade) {
        super(name, age);
        this.grade = grade;
    }
    //备注本例中若Student类不需要额外的属性，Student的构造器可以省略
    //重写从父类继承的方法
    // override 真正要重写父类方法 会自动检测 重新的方法名称是否与父类里的 名字相等
    speak() {
        console.log(`我是学生，我叫：${this.name}，今年${this.age}岁，在读${this.grade}年级`);
    }
    //子类自己的方法
    study() {
        console.log(`${this.name}正在努力学习中......`);
    }
}
// 抽象类举例： 必须实现其中的抽象⽅法
class Package {
    constructor(weight) {
        this.weight = weight;
    }
    // 通⽤⽅法：打印包裹详情
    printPackage() {
        console.log(`包裹重量为: ${this.weight}kg，运费为: ${this.calculate()}元`);
    }
}
//  标准包裹
class StandardPackage extends Package {
    constructor(weight, unitPrice // 每公⽄的固定费率
    ) {
        super(weight);
        this.unitPrice = unitPrice;
    }
    // 实现抽象⽅法：计算运费
    calculate() {
        console.log(this.weight, 'weight');
        console.log(this.unitPrice);
        return this.weight * this.unitPrice;
    }
}
// 创建标准包裹实例
const s1 = new StandardPackage(10, 5);
s1.printPackage();
// 特快包裹
class ExpressPackage extends Package {
    constructor(weight, unitPrice, // 每公⽄的固定费率（快速包裹更⾼）
    additional // 超出10kg以后的附加费
    ) {
        super(weight);
        this.unitPrice = unitPrice;
        this.additional = additional;
    }
    // 实现抽象⽅法：计算运费
    calculate() {
        if (this.weight > 10) {
            // 超出10kg的部分，每公⽄多收additional对应的价格
            return 10 * this.unitPrice + (this.weight - 10) * this.additional;
        }
        else {
            return this.weight * this.unitPrice;
        }
    }
}
// 创建特快包裹实例
const e1 = new ExpressPackage(13, 8, 2);
e1.printPackage();
// 约束规则是：传⼊的类型T必须具有length 属性
function logPerson(data) {
    console.log(data.length);
}
logPerson('hello');
