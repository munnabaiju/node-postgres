const express = require("express");
const { Client } = require("pg");
const bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

const client = new Client({
	connectionString: 'postgres://eqicusjytrrywf:2413575253895106d04334ec96f4ca79233c1d1c7027a3a229156da2d99ac817@ec2-44-199-9-102.compute-1.amazonaws.com:5432/d3vhecq62ghcal',
	ssl: {
		rejectUnauthorized: false,
	},
});

client.connect((err) => {
    if(err) {
        console.error(err);
    } else {
        console.log('postgres db connected.')
    }

});
const app = express();

app.get("/", (req, res) => {
	res.send("API connection successful. Use paths to do more stuff");
});

app.post("/create", jsonParser, (req, res) => {
	let listOfNewQuotes = req.body;
	console.log(JSON.stringify(req.body));
	let listOfRows = [];
	listOfNewQuotes.forEach((newQuote) => {
		listOfRows.push([
			newQuote.Age_Group_25_and_34__c,
			newQuote.commision_amount__c,
			newQuote.Annual_Premium__c,
			newQuote.Quote_Valid_Until__c,
			newQuote.PolicyQuoteDate__c,
			newQuote.PolicyEffectiveDate__c,
			newQuote.Number_of_Risk_Items__c,
			newQuote.NumberofdriversinHousehold__c,
			newQuote.applicant_age__c,
			newQuote.Id,
			newQuote.FiscalYear,
			newQuote.Probability,
			newQuote.Channel_Started__c,
			newQuote.PolicyInsuranceCarrier__c,
			newQuote.AccountId,
			newQuote.Applicants_Email__c,
			newQuote.businessrulesresult__c,
			newQuote.Link_to_Unirisx_Quote__c,
		]);
	});
	let query =
		`INSERT INTO quotes (Age_Group_25_and_34, Commision_Amount, Annual_Premium, Quote_Valid_Until, Quote_Date, Policy_Start_Date, Number_of_Vehicles, Number_of_drivers_in_Household, Applicant_Age, Quote_ID, Fiscal_Year, Probability, Channel_Started, Carrier, Account_ID, Applicant_Email, Business_rules_result_from_Radar, Link_to_Unirisx_Quote) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING id`;
	client.query(query, [listOfRows], function (err, result) {
		if (err) {
			console.log(err);
		} else {
			console.log("Rows Inserted");
		}
		client.end();
	});
});

app.post("/update", (req, res) => {
	let listOfUpdatedQuotes = req.body;
	let listOfRows = [];
	listOfUpdatedQuotes.forEach((newQuote) => {
		listOfRows.push([
			newQuote.age_group_25_and_34__c,
			newQuote.commision_amount__c,
			newQuote.annual_premium__c,
			newQuote.quote_valid_until__c,
			newQuote.policyquotedate__c,
			newQuote.policyeffectivedate__c,
			newQuote.number_of_risk_items__c,
			newQuote.numberofdriversinhousehold__c,
			newQuote.applicant_age__c,
			newQuote.fiscalyear,
			newQuote.probability,
			newQuote.channel_started__c,
			newQuote.policyinsurancecarrier__c,
			newQuote.accountid,
			newQuote.Applicants_Email__c,
			newQuote.businessrulesresult__c,
			newQuote.link_to_unirisx_quote__c,
			newQuote.id,
		]);
	});
	let query = `UPDATE quotes SET (Age_Group_25_and_34 = ?, Commision_Amount = ? = ?, Annual_Premium = ?, Quote_Valid_Until = ?, Quote_Date = ?, Policy_Start_Date = ?, Number_of_Vehicles = ?, Number_of_drivers_in_Household = ?, Applicant_Age = ?, Fiscal_Year = ?, Probability = ?, Channel_Started = ?, Carrier = ?, Account_ID = ?, Applicant_Email = ?, Business_rules_result_from_Radar = ?, Link_to_Unirisx_Quote = ? WHERE Quote_ID = ?)`;
	client.query(query, listOfRows, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			console.log("Rows updated");
		}
		client.end();
	});
});

app.listen(process.env.PORT || 3000, () => {
	console.log('Server Started');
});
