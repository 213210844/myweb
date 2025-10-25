export const cardData = [
    {
        id: 1,
        title: '基本Prompt用法',
        description: '点击按钮将显示一个提示框，要求输入您的姓名，然后显示欢迎消息。',
        buttonText: '显示提示框',
        type: 'basic'
    },
    {
        id: 2,
        title: '带验证的Prompt',
        description: '此示例要求输入年龄，并验证输入是否为有效数字。如果输入无效，将显示错误消息。',
        buttonText: '输入年龄',
        type: 'validation'
    },
    {
        id: 3,
        title: '条件交互',
        description: '根据用户输入显示不同的响应。输入"是"或"否"来查看不同的消息。',
        buttonText: '询问偏好',
        type: 'conditional'
    },
    {
        id: 4,
        title: '计算器示例',
        description: '使用prompt获取两个数字并计算它们的和，展示实际应用场景。',
        buttonText: '数字相加',
        type: 'calculator'
    },
    {
        id: 5,
        title: '取消处理',
        description: '演示当用户取消prompt对话框时的处理方式。',
        buttonText: '测试取消',
        type: 'cancel'
    },
    {
        id: 6,
        title: '代码示例',
        description: '查看实现这些交互的JavaScript代码。',
        buttonText: '显示更多代码',
        type: 'code',
        code: `// 基本Prompt用法
document.getElementById('basicBtn').addEventListener('click', function() {
    let name = prompt('请输入您的姓名：', '张三');
    if (name) {
        document.getElementById('basicResult').innerHTML = '欢迎，' + name + '！';
    } else {
        document.getElementById('basicResult').innerHTML = '您取消了输入。';
    }
});`
    }
];
