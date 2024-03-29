// 获取日记列表
token = localStorage.getItem('jwtToken');

fetch('/get_ztb',{
    headers: {
        'Authorization': token,
    }})                
    //将字符串，转换为json对象
    .then(response => {
        if (response.status === 401) {
            console.error(response)
            // Redirect to the login page or handle unauthorized access as needed
            window.location.href = '/login.html'; // Replace '/login' with the actual login page URL
        }
        return response.json();
    })
    .then(diaries => {
        // 在页面上显示日记列表
        const diaryList = document.getElementById('diary-list'); //获取 ID 为 diary-list 的元素节点对象，并将它赋值给变量 diaryList
        //console.log(diaries)
        diaries.forEach(diary => { //.forEach() 方法遍历 diaries 数组中的每个日记对象  //diaries 是一个数组
            const content = diary.content;
            const pre = document.createElement('pre');
            pre.textContent = content;
            diaryList.appendChild(pre);
        });
    });

const dateObj = new Date(); // new Date() 创建一个新的 Date 对象时，它会自动根据当前系统的日期和时间信息，初始化一个包含各种日期和时间属性的对象。
const dateStr = dateObj.toLocaleDateString(); // 获取当前日期字符串
const timeStr = dateObj.toLocaleTimeString(); // 获取当前时间字符串
// 提交日记表单
const form = document.getElementById('diary-form'); // document.getElementById()  方法获取了 ID 为 diary-form 的表单元素节点：
form.addEventListener('submit', event => { //使用 .addEventListener() 方法，在该表单元素上注册一个 submit 事件监听器。这个监听器会在表单提交时被触发，并执行指定的回调函数。
    event.preventDefault(); //不刷新

    const content_old = document.getElementById('diary-content').value; //获取文本框中的值。
    const content = `## ${dateStr} ${timeStr}:\n` + content_old; //日期+时间 换行 +输入内容。
    // 发送日记内容到后台
    fetch('/submit_ztb', {  // 请求地址
        method: 'POST',  // HTTP 方法
        headers: {
            'Content-Type': 'application/json'// 请求头 表示请求体中的数据类型是 JSON
        },
        body: JSON.stringify({content}) // 请求体 将一个对象 {content: content} 转换为 JSON 格式的字符串。
    })
    .then(response => response.json())
    .then(diary => {
        // 在页面上显示新保存的日记
        const content = diary.content;
        const pre = document.createElement('pre');
        pre.textContent = content;
        const diaryList = document.getElementById('diary-list');
        // 将p元素放在diaryList第一个元素的前面，即p元素放在最前面
        diaryList.insertBefore(pre, diaryList.firstChild);
        
        // 清空表单
        const form = document.getElementById('diary-form');
        form.reset();
    });
});