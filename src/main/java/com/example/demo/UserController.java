package com.example.demo;

import java.util.Date;
import java.util.Map;
import com.razorpay.*;

import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class UserController {
	public String[] ReceiptValue = new String[13];
	public String dateValue;
	@GetMapping(value = "/")
	public String home() {
		return "index";
	}
	
	@GetMapping("/donationForm")
	public String form() {
		return "donation_form";
	}
	
	@PostMapping("/sendReceipt")
	@ResponseBody
	public String receiptd(@RequestBody Map<String, Object> data, Model model) {
		int i = 0;
		for (Map.Entry<String, Object> entity : data.entrySet()) {
			ReceiptValue[i] = entity.getValue().toString();
			System.out.println(ReceiptValue[i]);
			i++;
		}
		final Date date = new Date();
		dateValue = date.toString();
		return "success";
	}
	
	@GetMapping("/finalReceiptView")
	public String receipt(Model model) throws  Exception {
		
		model.addAttribute("fullname",ReceiptValue[0]);
		model.addAttribute("mobile",ReceiptValue[1]);
		model.addAttribute("email",ReceiptValue[2]);
		model.addAttribute("address",ReceiptValue[3]);
		model.addAttribute("topic",ReceiptValue[4]);
		model.addAttribute("amount",ReceiptValue[5]);
		model.addAttribute("paid_amount",ReceiptValue[6]);
		model.addAttribute("due_amount",ReceiptValue[7]);
		model.addAttribute("currency_type",ReceiptValue[8]);
		model.addAttribute("status",ReceiptValue[9]);
		//model.addAttribute("payment_date",ReceiptValue[10]);
		model.addAttribute("payment_date",dateValue);
		model.addAttribute("order_id",ReceiptValue[11]);
		model.addAttribute("payment_id",ReceiptValue[12]);
		return "final_receipt";
	}
	
	//Creating oder for payment
	
	@PostMapping("/create_order")
	@ResponseBody
	public String createOrder(@RequestBody Map<String, Object> data) throws  Exception {
		System.out.println(data);
		
		int amt = Integer.parseInt(data.get("amount").toString());
		
		RazorpayClient client = new RazorpayClient("rzp_test_ijdMeozLcYhmHw","tWUq6tF8Eqbx09OePK6g9K0G");
		
		JSONObject options = new JSONObject();
		options.put("amount", amt*100); // Rupees to Paice
		options.put("currency", "INR");
		options.put("receipt", "txn_123456");
		
		//Creating new order
		
		Order order = client.Orders.create(options);
		System.out.println(order);
		
		return order.toString();
	}
}
