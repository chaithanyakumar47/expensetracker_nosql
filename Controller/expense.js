const Expense = require('../models/Expenses');
const Download = require('../models/downloads');
const User = require('../models/User')
const sequelize = require('../util/database');
const AWS = require('aws-sdk');
const Userservices = require('../services/userservices');
const S3services = require('../services/S3services');


const addExpense = async (req, res) => {
    try{
        const { date, description, amount, category, income } = req.body
        const userId = req.user._id
        const currentIncome = req.user.totalIncome;
        const updatedIncome = currentIncome + parseInt(income)
        const currentExpense = req.user.totalExpenses
        const updatedExpense = currentExpense + parseInt(amount)
        if (description){
            const expense = new Expense({ date, description, amount, category, income, userId});
            await expense.save()
            await req.user.updateOne({ totalExpenses: updatedExpense})
            res.status(201).json(expense)
        } else {
            const expense = new Expense.create({ date, income, userId});
            await expense.save()
            await req.user.updateOne({ totalIncome: updatedIncome})
            res.status(201).json(expense)
        }
        
        

    } catch (err) {
        
        res.json(err);
    }
}


const getExpense = async (req, res) => {
    try {
      const ITEMS_PER_PAGE = parseInt(req.header('rows')) || 2;
      const page = +req.query.page || 1;
      const totalItems = await Expense.countDocuments({ userId: req.user._id });
      const expenses = await Expense.find({ userId: req.user._id })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
  
      res.status(200).json({
        expenses,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    } catch (err) {
      res.status(500).json(err);
    }
  };
  
  

  const deleteExpense = async (req, res) => {
    try {
      const userId = req.user._id;
      const expenseId = req.params.id;
      const expense = await Expense.findOne({ _id: expenseId, userId });
  
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
  
      const expenseAmount = expense.amount;
      const currentAmount = req.user.totalExpenses;
      const updatedExpense = currentAmount - expenseAmount;
  
      await expense.deleteOne();
      await req.user.updateOne({ totalExpenses: updatedExpense });
  
      res.status(200).json({ message: 'Expense deleted' });
    } catch (err) {
      res.status(500).json(err);
      console.log(err)
    }
  };


  const download = async (req, res) => {
    try {
      const expenses = await Expense.find({ userId: req.user._id })
      const stringifiedExpenses = JSON.stringify(expenses);
  
      const userId = req.user._id;
      const filename = `Expenses${userId}/${new Date()}.txt`;
      const fileInfo = await S3services.uploadToS3(stringifiedExpenses, filename);
      const fileUrl = fileInfo.Location;
  
      const download = new Download({ name: filename, url: fileUrl, userId });
      await download.save();
  
      res.status(200).json({ fileUrl, fileInfo });
    } catch (err) {
      console.log(err);
      res.status(500).json({ fileUrl: '', success: false, err });
    }
  };



  const getDownloads = async (req, res) => {
    try {
      const downloads = await Download.find({ userId: req.user._id });
      res.status(200).json(downloads);
    } catch (err) {
      res.status(500).json({ err });
    }
  };

module.exports = {
    addExpense,
    getExpense,
    deleteExpense,
    download,
    getDownloads
}