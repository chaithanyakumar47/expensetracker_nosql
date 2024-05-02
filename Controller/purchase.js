const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/User')


const premiumMembership = async (req, res) => {
    try {
      const rzp = new Razorpay({
        key_id: 'rzp_test_cRoRjmigPejCkJ',
        key_secret: 'Q8H3X5tzJRoHg2y4ZiAaPZpd'
      });
  
      const amount = 2500;
  
      const order = await rzp.orders.create({ amount, currency: "INR" });
  
      const newOrder = new Order({
        paymentid: 'PENDING',
        orderid: order.id,
        status: 'PENDING',
        userId: req.user._id
      });
  
      await newOrder.save();
  
      return res.status(201).json({ order, key_id: rzp.key_id });
    } catch (err) {
      console.log(err);
      res.status(403).json({ message: 'Something went wrong', error: err });
    }
  };

  const updateTransactionStatus = async (req, res) => {
    try {
      const { payment_id, order_id } = req.body;
      const order = await Order.findOne({ orderid: order_id });
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      order.paymentid = payment_id;
      order.status = 'SUCCESSFUL';
      await order.save();
  
      const user = await User.findById(order.userId);
      user.isPremium = true;
      await user.save();
  
      return res.status(201).json({ success: true, message: "Transaction Successful" });
    } catch (err) {
      console.log(err);
      res.status(403).json({ error: err, message: 'Something went wrong' });
    }
  };
  

  const failedTransaction = async (req, res) => {
    try {
      const { payment_id, order_id } = req.body;
      const order = await Order.findOne({ orderid: order_id });
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      order.paymentid = payment_id;
      order.status = 'FAILED';
      await order.save();
  
      const user = await User.findById(order.userId);
      user.isPremium = false;
      await user.save();
  
      return res.status(200).json({ success: false, message: "Transaction Failed" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err, message: 'Something went wrong' });
    }
  };

module.exports = {
    premiumMembership,
    updateTransactionStatus,
    failedTransaction
}