import { useState } from 'react';

export const usePrompt = () => {
    const [result, setResult] = useState('');

    const showPrompt = (message, defaultValue = '') => {
        return new Promise((resolve) => {
            const userInput = prompt(message, defaultValue);
            resolve(userInput);
        });
    };

    const basicPrompt = async () => {
        const name = await showPrompt('请输入您的姓名：', '张三');
        if (name) {
            setResult(`欢迎，${name}！`);
        } else {
            setResult('您取消了输入。');
        }
    };

    const validationPrompt = async () => {
        const ageInput = await showPrompt('请输入您的年龄：');
        if (ageInput === null) {
            setResult('您取消了输入。');
            return;
        }

        const age = parseInt(ageInput);
        if (isNaN(age) || age <= 0 || age > 120) {
            setResult('请输入有效的年龄（1-120）！');
        } else {
            setResult(`您的年龄是：${age} 岁。`);
        }
    };

    const conditionalPrompt = async () => {
        const response = await showPrompt('您喜欢JavaScript吗？（是/否）');
        if (response === null) {
            setResult('您取消了输入。');
            return;
        }

        const lowerResponse = response.toLowerCase();
        if (lowerResponse === '是' || lowerResponse === 'yes') {
            setResult('太好了！JavaScript是一门强大的语言！');
        } else if (lowerResponse === '否' || lowerResponse === 'no') {
            setResult('也许您会慢慢喜欢上它的！');
        } else {
            setResult('请输入"是"或"否"。');
        }
    };

    const calculatorPrompt = async () => {
        const num1Input = await showPrompt('请输入第一个数字：');
        if (num1Input === null) return;

        const num2Input = await showPrompt('请输入第二个数字：');
        if (num2Input === null) return;

        const num1 = parseFloat(num1Input);
        const num2 = parseFloat(num2Input);

        if (isNaN(num1) || isNaN(num2)) {
            setResult('请输入有效的数字！');
        } else {
            const sum = num1 + num2;
            setResult(`${num1} + ${num2} = ${sum}`);
        }
    };

    const cancelPrompt = async () => {
        const input = await showPrompt('请输入一些内容（或点击取消）：');
        if (input === null) {
            setResult('您点击了取消按钮。');
        } else if (input === '') {
            setResult('您输入了空字符串。');
        } else {
            setResult(`您输入了：${input}`);
        }
    };

    return {
        result,
        setResult,
        basicPrompt,
        validationPrompt,
        conditionalPrompt,
        calculatorPrompt,
        cancelPrompt
    };
};
