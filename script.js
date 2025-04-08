"use strict";

const errorMesgEl = document.querySelector('.error_message');
const budgetInputEl = document.querySelector('.budget_input');
const expenseDesEl = document.querySelector('.expenses_input');
const expenseAmountEl = document.querySelector('.expenses_amount');
const tblRecordEl = document.querySelector(".tbl_data");

const budgetCardEl = document.querySelector(".budget_card");
const expenseCardEl = document.querySelector(".expenses_card");
const balanceCardEl = document.querySelector(".balance_card");

let itemList = [];
let itemId = 0;

function btnEvents() {
    document.querySelector('#btn_budget').addEventListener('click', (e) => {
        e.preventDefault();
        budgetFun();
    });

    document.querySelector('#btn_expenses').addEventListener('click', (e) => {
        e.preventDefault();
        expensesFun();
    });
}

document.addEventListener("DOMContentLoaded", btnEvents);

function budgetFun() {
    const budgetValue = parseFloat(budgetInputEl.value);
    if (isNaN(budgetValue) || budgetValue <= 0) {
        showError("Please enter a valid budget greater than 0");
    } else {
        budgetCardEl.textContent = budgetValue;
        budgetInputEl.value = "";
        showBalance();
    }
}

function expensesFun() {
    const desc = expenseDesEl.value.trim();
    const amount = parseFloat(expenseAmountEl.value);

    if (desc === "" || isNaN(amount) || amount <= 0) {
        showError("Please enter a valid expense description and amount");
        return;
    }

    const expense = {
        id: itemId++,
        title: desc,
        amount: amount
    };

    itemList.push(expense);
    expenseDesEl.value = "";
    expenseAmountEl.value = "";

    addExpenseToTable(expense);
    showBalance();
}

function addExpenseToTable(expense) {
    const html = `
        <ul class="tbl_tr_content" data-id="${expense.id}">
            <li>${expense.id}</li>
            <li>${expense.title}</li>
            <li><span>$</span>${expense.amount}</li>
            <li>
                <button type="button" class="btn_edit">Edit</button>
                <button type="button" class="btn_delete">Delete</button>
            </li>
        </ul>
    `;
    tblRecordEl.insertAdjacentHTML("beforeend", html);

    const row = tblRecordEl.querySelector(`[data-id="${expense.id}"]`);
    row.querySelector(".btn_edit").addEventListener("click", () => editExpense(expense.id));
    row.querySelector(".btn_delete").addEventListener("click", () => deleteExpense(expense.id));
}

function editExpense(id) {
    const expense = itemList.find(item => item.id === id);
    if (!expense) return;

    expenseDesEl.value = expense.title;
    expenseAmountEl.value = expense.amount;

    itemList = itemList.filter(item => item.id !== id);
    document.querySelector(`[data-id="${id}"]`).remove();
    showBalance();
}

function deleteExpense(id) {
    itemList = itemList.filter(item => item.id !== id);
    document.querySelector(`[data-id="${id}"]`).remove();
    showBalance();
}

function totalExpenses() {
    const total = itemList.reduce((sum, item) => sum + item.amount, 0);
    expenseCardEl.textContent = total;
    return total;
}

function showBalance() {
    const total = parseFloat(budgetCardEl.textContent || 0) - totalExpenses();
    balanceCardEl.textContent = total;
}

function showError(message) {
    errorMesgEl.innerHTML = `<p>${message}</p>`;
    errorMesgEl.classList.add('error');
    setTimeout(() => {
        errorMesgEl.classList.remove('error');
    }, 2500);
}
