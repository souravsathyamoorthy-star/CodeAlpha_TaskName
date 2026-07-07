document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addBtn");
    const todoList = document.getElementById("todoList");
    const progressList = document.getElementById("progressList");
    const doneList = document.getElementById("doneList");

    async function loadTasks() {
        try {
            let response = await fetch('http://localhost:5001/get-tasks');
            let tasks = await response.json();

            todoList.innerHTML = '';
            progressList.innerHTML = '';
            doneList.innerHTML = '';

            tasks.forEach(task => {
                let btnCode = '';
                
                if (task.status === 'Todo') {
                    btnCode = `<button class="move-btn" onclick="changeStatus('${task._id}', 'Progress')">Start ➡️</button>`;
                } else if (task.status === 'Progress') {
                    btnCode = `<button class="move-btn" onclick="changeStatus('${task._id}', 'Done')">Finish ➡️</button>`;
                }

                let card = `
                    <div class="task-card">
                        <h5>${task.taskTitle}</h5>
                        <p style="font-size:12px; color:#555;">${task.taskDesc}</p>
                        <small style="color:blue;">Assigned: ${task.assignedStudent}</small><br>
                        ${btnCode}
                    </div>
                `;

                if (task.status === 'Todo') todoList.innerHTML += card;
                else if (task.status === 'Progress') progressList.innerHTML += card;
                else if (task.status === 'Done') doneList.innerHTML += card;
            });
        } catch (err) {
            console.log("Run server3.js on port 5001!");
        }
    }

    async function addTask() {
        let title = document.getElementById('taskTitle').value;
        let desc = document.getElementById('taskDesc').value;
        let student = document.getElementById('student').value;

        if (!title) return alert("Title is matching field required!");

        await fetch('http://localhost:5001/add-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskTitle: title, taskDesc: desc, assignedStudent: student })
        });

        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDesc').value = '';
        document.getElementById('student').value = '';
        loadTasks();
    }

    window.changeStatus = async function(id, newStatus) {
        await fetch(`http://localhost:5001/move-task/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        loadTasks();
    };

    addBtn.addEventListener("click", addTask);
    loadTasks();
});