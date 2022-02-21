
// desable browser back button
window.history.forward();
window.onunload = function () { null };

function openForm(){
	$.ajax({
		url:'/donationForm',
		type:'GET',
		success:function(response) { 
			window.location = '/donationForm';
        }
			
	});
}

function printReceipt(){
	window.print();
}

let data = {
	fullname: '', mobile: '', email: '', address: '', topic: '', amount: '',
	paid_amount: '', due_amount: '', status: '', order_id: '', payment_id: '',
	payment_date: '', currency_type: ''
}

// first request to the server to create order
const paymentStart = () => {
	console.log("payment started..");
	
	let fname = $("#fname").val();
	let lname = $("#lname").val();
	let fullname = fname+" "+lname//fname.concat(lname);
	
	let mobile = $("#mobile").val();
	let email = $("#email").val();
	let address = $("#address").val();
	let topic = $("#donate_for").val();	
			 
 	let amount = $("#donate_amount").val();
 	console.log(amount);
 	
 	var name = /^[A-Za-z\s]+$/;
 	 	
 	if(fname == '' || fname == null){
		swal("Sorry!", "First Name is required!!", "warning")
		return;
	}
 	
 	if(!fname.match(name)){
		swal("Sorry!", "First Name is invalid!!", "warning")
		return;
	}
 	
 	if(lname == '' || lname == null){
		swal("Sorry!", "Last Name is required!!", "warning")
		return;
	}
	
	if(!lname.match(name)){
		swal("Sorry!", "Last Name is invalid!!", "warning")
		return;
	}
	
	if(mobile == '' || mobile == null){
		swal("Sorry!", "Mobile Number is required!!", "warning")
		return;
	}
	
	var phoneno = /^\d{10}$/;
 	if(!mobile.match(phoneno)){
		swal("Sorry!", "Mobile Number is invalid!!", "warning")
		return;
	}
	
	if(email == '' || email == null){
		swal("Sorry!", "Email Id is required!!", "warning")
		return;
	}
	
 	
 	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
 	if(!email.match(mailformat))
  	{
    	swal("Sorry!", "Email Id is invalid!!", "warning")
		return;
  	}
 	
 	if(topic == '' || topic == null){
		 //alert("Topic is Required!");
		 swal("Sorry!", "Topic is required!!", "warning")
		 return;
	}
	if(amount == '' || amount == null){
		 //alert("Amount is Required!");
		 swal("Sorry!", "Amount is required!!", "warning")
		 return;
	}
	
	//send request to the server to create order - jquery
	$.ajax({
		url:'/create_order',
		data:JSON.stringify({fullname: fullname, mobile: mobile, email: email, address: address, topic: topic, amount: amount, info: 'order_request'}),
		contentType:'application/json',
		type:'POST',
		dataType:'json',
		success:function(response){
			//invoked when success
			console.log(response);
			if(response.status == "created"){
				//open payment form
				let options={
					key: 'rzp_test_ijdMeozLcYhmHw',
					amount: response.amount,
					currency: 'INR',
					name: topic,
					description: 'Donation for Trees!',
					image: 'http://rajkumarsony.github.io/assets/img/hero.jfif',
					order_id: response.id,
					handler: function(receipt){
						console.log(receipt.razorpay_payment_id)
						console.log(receipt.razorpay_order_id)
						console.log(receipt.razorpay_signature)

						console.log('Payment has been don successful!')
						//alert('Payment has been done successful!!');
						swal("Good job!", "Payment has been done successful!!", "success")
						
						//display all receipt value
						for(const property in receipt) {
    						console.log(`receipt[${property}] = ${receipt[property]}`);
						}
						
						// set all data as an object element
						data.fullname = fullname
						data.mobile = mobile
						data.email = email
						data.address = address
						data.topic = topic
						data.amount = response.amount/100
						data.paid_amount = response.amount/100
						data.due_amount = 0
						data.currency_type = response.currency
						data.status = 'Success!'
						data.payment_date = new Date()
						data.order_id = receipt.razorpay_order_id
						data.payment_id = receipt.razorpay_payment_id
						
						for(const property in data) {
    						console.log(`data[${property}] = ${data[property]}`);
						}
						load_receipt(data)						
					},
					prefill: {
				        name: "",
				        email: "",
				        contact: ""
				    },
				    notes: {
				        address: ""	//write something (optional)
				    },
				    theme: {
						hide_topbar: true,
				        color: "#ffffff"
				        //color: "#3399cc",
				        //backdrop_color: "#444000"
				    }
				};
								
				let rzp = new Razorpay(options);
				
				rzp.on('payment.failed', function (response){
				        console.log(response.error.code);
				        console.log(response.error.description);
				        console.log(response.error.source);
				        console.log(response.error.step);
				        console.log(response.error.reason);
				        console.log(response.error.metadata.order_id);
				        console.log(response.error.metadata.payment_id);
						//alert('Oops! payment failed!!]');
						swal("Uff!", "Oops! payment failed!!", "error")
				});
				rzp.open();
			}	
		},
		error:function(error){
			//invoked when success
			console.log(error);
			//alert("Something went wrong!!");
			swal("Failed!", "Amount is required!!", "error")
		}
	});
}


function load_receipt(args){

	$.ajax({
		url:'/sendReceipt',
		data:JSON.stringify({
								fullname: args.fullname, mobile: args.mobile, email: args.email, address: args.address,
								topic: args.topic, amount: args.amount, paid_amount: args.paid_amount, due_amount: args.due_amount,
								currency_type: args.currency_type, status: args.status, payment_date: args.payment_date,
								order_id: args.order_id, payment_id: args.payment_id
		}),
		contentType:'application/json',
		type:'POST',
		dataType:'json',
		success:function(response) {},
	    error:function(error){}
	});
	
	$.ajax({
		url:'/finalReceiptView',
		type:'GET',
		success:function(response) { 
			window.setTimeout(function(){
				window.location = '/finalReceiptView';
			}, 3000);
	    },
	    error:function(error){}
	});
}