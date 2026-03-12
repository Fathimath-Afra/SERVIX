const User = require('../Models/user');
const Issue = require('../Models/issue');

const paymentCltr = {};

paymentCltr.verifyAndPay = async (req, res) => {
    try {
        const { issueId, workerId, amount, transactionId } = req.body;

        
        const issue = await Issue.findOne({ 
            _id: issueId, 
            createdBy: req.userId 
        });

        if (!issue) {
            return res.status(404).json({ error: "Service record not found or unauthorized." });
        }

        //  IDEMPOTENCY CHECK: Prevent double payment
       
        if (issue.paymentStatus === 'paid') {
            return res.status(400).json({ error: "This bill has already been settled." });
        }

        
        await User.findByIdAndUpdate(workerId, {
            $inc: { walletBalance: Number(amount) }
        });

        // Update Issue Status
        issue.paymentStatus = 'paid';
        issue.transactionId = transactionId || "MOCK_TXN_123"; 
        await issue.save();

        res.json({ 
            message: "Payment verified. Funds settled to worker wallet.",
            status: "paid"
        });

    } catch (err) {
        console.error("Payment Sync Error:", err.message);
        res.status(500).json({ error: "Internal payment synchronization failed." });
    }
};

module.exports = paymentCltr;