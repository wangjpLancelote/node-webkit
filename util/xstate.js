'use strict'

const { Machine, interpret } = require('xstate');

const toggleMachine = Machine({
    id: 'toggle',  // 状态机id 区分多个状态机实例
    initial: 'inactive',  //默认状态
    states: { //状态列表 , 可自定义
        inactive: {on: { TOGGLE: 'active' }},
        active: {on: { TOGGLE: 'inactive' }}
    }
});

const toggleService = interpret(toggleMachine)
    .onTransition((state) => console.log(state.value))
    .start();

// toggleService.send('TOGGLE');
// toggleService.send('TOGGLE');

const lightMachine = Machine({
    id: 'light',
    initial: 'green',
    states: {
        green: {
            on: {
                TIMER: 'yellow'
            }
        },
        yellow: {
            on: {
                TIMER: 'red'
            }
        },
        red: {
            on: {
                TIMER: 'green'
            }
        }
    }
});

const currentState = 'green';
const nextState = lightMachine.transition(currentState, 'TIMER').value;
console.log('nextState', nextState);
const timerService = interpret(lightMachine)
    .onTransition(state => console.log(state.value))
    .start(); //默认状态 green

//状态的跳转
timerService.send('TIMER'); //yellow
timerService.send('TIMER'); //red
timerService.send('TIMER'); //green
timerService.send('TIMER'); //yellow
/**状态机可以多个machine 的重用 */

