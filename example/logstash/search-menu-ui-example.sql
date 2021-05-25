DROP TABLE IF EXISTS "search_menu_ui_example"."account";
DROP TABLE IF EXISTS ACCOUNT;

CREATE TABLE ACCOUNT (
	tenantnumber DECIMAL(5, 0) NOT NULL,
	customernumber DECIMAL(11, 0) NOT NULL,
	accountnumber DECIMAL(11, 0) NOT NULL,
	iban VARCHAR(34) NOT NULL,
	businesstype VARCHAR(255) NOT NULL,
	product VARCHAR(255) NOT NULL,
	disposer VARCHAR(255) NOT NULL,
	owner VARCHAR(255) NOT NULL DEFAULT '',
	accountmanager VARCHAR(255) NOT NULL,
	currency VARCHAR(255) NOT NULL,
	
	online SMALLINT NOT NULL DEFAULT 0,
	deleted SMALLINT NOT NULL DEFAULT 0,
	longterm SMALLINT NOT NULL DEFAULT 0,
	shortterm SMALLINT NOT NULL DEFAULT 0,
	bulletbond SMALLINT NOT NULL DEFAULT 0,
	
	creationdate DATE NOT NULL DEFAULT CURRENT_DATE,
	updatetime TIMESTAMP NULL,
	PRIMARY KEY (tenantnumber, accountnumber)
);

INSERT INTO ACCOUNT (
 tenantnumber, customernumber, accountnumber, iban, 
 businesstype, product, disposer, owner, accountmanager, currency, 
 online, 
 creationdate, updatetime
) values (
 999, 00001234567, 12345678901, 'AT424321012345678901', 
 'Giro', 'Salary', 'Hans Mustermann', '', 'Sarah Connor', 'EUR',
 1,
 '2020-08-08', '2021-04-08 08:31:30.00'
);

INSERT INTO ACCOUNT (
 tenantnumber, customernumber, accountnumber, iban, 
 businesstype, product, disposer, owner, accountmanager, currency, 
 online, 
 creationdate, updatetime
) values (
 999, 00001234568, 12345678902, 'AT424321012345678902', 
 'Giro', 'Commercial Giro', 'Howard Joel Wolowitz', 'Wolowitz KG', 'Clara Claton', 'EUR',
 1,
 '2020-08-08', '2021-04-08 08:37:30.00'
);

INSERT INTO ACCOUNT (
 tenantnumber, customernumber, accountnumber, iban, 
 businesstype, product, disposer, owner, accountmanager, currency, 
 deleted, bulletbond, longterm,
 creationdate, updatetime
) values (
 999, 00001234569, 12345678903, 'AT424321012345678903', 
 'Loan', 'Housing Loan', 'Carlo Solér', '', 'Sarah Connor', 'EUR',
 1, 1, 1,
 '2020-08-08', '2021-04-08 08:42:30.00'
);

INSERT INTO ACCOUNT (
 tenantnumber, customernumber, accountnumber, iban, 
 businesstype, product, disposer, owner, accountmanager, currency, 
 deleted, 
 creationdate, updatetime
) values (
 999, 00001234569, 12345678904, 'AT424321012345678904', 
 'Giro', 'Private Giro', 'Howard Joel Wolowitz', '', 'Clara Claton', 'EUR',
 0, 
 '2020-08-08', '2021-04-08 08:58:30.00'
);

INSERT INTO ACCOUNT (
 tenantnumber, customernumber, accountnumber, iban, 
 businesstype, product, disposer, owner, accountmanager, currency, 
 deleted, shortterm,
 creationdate, updatetime
) values (
 999, 00001234570, 12345678905, 'AT424321012345678905', 
 'Loan', 'Private Loan', 'Klara Klammer', '', 'Clara Claton', 'CHF',
 0, 1,
 '2020-08-08', '2021-04-08 14:20:30.00'
);

INSERT INTO ACCOUNT (
 tenantnumber, customernumber, accountnumber, iban, 
 businesstype, product, disposer, owner, accountmanager, currency, 
 deleted, shortterm,
 creationdate, updatetime
) values (
 888, 00000000001, 12345678906, 'AT424321012345678906', 
 'Loan', 'Private Loan', 'Michael Mair', '', 'John McClane', 'EUR',
 0, 1,
 '2020-08-08', '2021-04-08 18:36:30.00'
);

INSERT INTO ACCOUNT (
 tenantnumber, customernumber, accountnumber, iban, 
 businesstype, product, disposer, owner, accountmanager, currency, 
 deleted,
 creationdate, updatetime
) values (
 999, 00001234571, 12345678907, 'AT424321012345678907', 
 'Giro', 'Trust', 'Carlo Martinez', '', 'Sarah Connor', 'EUR',
 0,
 '2020-08-09', '2021-04-09 08:20:30.00'
);

INSERT INTO ACCOUNT (
 tenantnumber, customernumber, accountnumber, iban, 
 businesstype, product, disposer, owner, accountmanager, currency, 
 deleted,
 creationdate, updatetime
) values (
 999, 00001234572, 12345678908, 'AT424321012345678908', 
 'Giro', 'Salary', 'Carmen Martin', '', 'Clara Claton', 'EUR',
 0,
 '2020-08-09', '2021-04-09 08:22:30.00'
);

INSERT INTO ACCOUNT (
 tenantnumber, customernumber, accountnumber, iban, 
 businesstype, product, disposer, owner, accountmanager, currency, 
 deleted,
 creationdate
) values (
 999, 00001234572, 12345678909, 'AT424321012345678909', 
 'Giro', 'Private Giro', 'Carmen Martin', '', 'Clara Claton', 'EUR',
 0,
 '2020-08-10'
);


SELECT * FROM ACCOUNT;

-- Draft for a query that provides accounts and a number "dateid" containing the "updatetime" and the "accountnumber".
-- This number can be used for the subsequent query to get the next x rows with focus on recently changed ones.
SELECT CAST((coalesce(year(updatetime), 1900) * 100 * 100 * 100000000000 + coalesce(month(updatetime), 1) * 100 * 100000000000 + coalesce(day(updatetime), 1) * 100000000000 + accountnumber) AS DECIMAL(19,0)) as dateid
      ,*
  FROM ACCOUNT
 WHERE (12345678906 < 100000000000 AND accountnumber > 12345678906)
    OR  CAST(updatetime AS DATE) > CAST(PARSEDATETIME(SUBSTRING(CAST(12345678906 AS CHAR), 0, 8),'yyyyMMdd') AS DATE)
    OR (CAST(updatetime AS DATE) = CAST(PARSEDATETIME(SUBSTRING(CAST(12345678906 AS CHAR), 0, 8),'yyyyMMdd') AS DATE)
   AND  accountnumber > MOD(12345678906, 100000000000)) 
  order by updatetime, accountnumber
 limit 1000 	
;
--2021040812345678906
--12345678906