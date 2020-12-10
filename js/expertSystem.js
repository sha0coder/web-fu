/*
	Web-Fu
	
	Expert System

	attack, identify interesting errors in code html
	alex.novella@blueliv.com


	TODO: usar regexps
*/

(function() {

	expert = {
		errors: [
			'Microsoft OLE DB Provider'
			'SQL Server error',
			'ODBC Drivers error',
			'Informix ODBC Driver',
			'Microsoft SQL Native Client error',
			'Unclosed quotation mark before the character string',
			'[Microsoft][ODBC SQLServer Driver][SQL Server]',
			'You have an error in your SQL syntax',
			'ORA-',
			'SQL command not properly ended',
			'Query failed: ERROR: syntax error at or near',
			'DB2 SQL Error:',
			'OperationalError: near',
			'org.firebirdsql.jdbc.FBSQLException:',
			'[Informix ODBC Driver]',
			'[ODBC Visual FoxPro Driver]',
			'SOLID Procedure Error',
			'command not found',
			'no se reconoce como un comando interno o externo',
			'java.lang.NullPointerException',
			'java.lang.OutOfBoundsException'
		],

		success: [
			'root:x:0:0:root' //TODO: reforzar esta lista
		],

		bdengines: [
			'Postgre',
			'Oracle',
			'Mysql',
			'Access',
			'DB2',
			'SQLite',
			'Firebird',
			'Informix',
			'Solid DB'
		];
	};

})();