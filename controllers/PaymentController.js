
// import Razorpay from 'razorpay'

const Razorpay = require('razorpay');
const razorpay = new Razorpay({
    key_id: "rzp_test_CFaCcyskyo1gnl",
    key_secret: "yiNmn4Vd7gnbxEEYmgNumQTz",
  });


// exports.InstructorDataController = async (req,res) => {
    
//     try {
//         const teacherData = await teacherSchema.find();
//         console.log(teacherData )
    
//         if (teacherData.length > 0) {
//           res.status(200).json( teacherData );
//         } else {
//           res.status(404).json({ error: "Teacher data not found" });
//         }
//       } catch (error) {
//         console.error("error: " + error.message);
//         res.status(500).json({ error: error.message });
//       }

// }

exports.PaymentController=async (req, res) => {
    const options = {
      currency: 'INR',
      receipt: 'receipt_order_1',
    };
  
    try {
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      res.status(500).send(error);
    }
};