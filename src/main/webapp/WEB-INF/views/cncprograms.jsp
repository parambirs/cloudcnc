<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page isELIgnored="false" %>

<html lang="en">
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet"
	href="//netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css">
</head>
<body>

	<div class="container">
		<div class="page-header">
			<h1>Cloud CNC</h1>
		</div>

		<div>
			<h3>Add New Program</h3>
			<form action="/add" method="post" role="form">
				<div class="form-group">
					<label for="programName">Name</label> 
					<input type="text" id="programName"
						name="programName" class="form-control" placeholder="CNC Program Name" />
				</div>
				<div class="form-group">
					<label for="sourceCode">Source Code</label>
					<textarea id="sourceCode" name="sourceCode" class="form-control"
						placeholder="CNC Program Code"></textarea>
				</div>

				<button type="submit" class="btn btn-primary">Save</button>
				<a href="/cncprograms" class="btn btn-default" role="button">Cancel</a>
			</form>
		</div>
		<hr />
		<table class="table table-striped">
			<tbody>
				<tr>
					<th>Program Name</th>
					<th>Created</th>
					<th></th>
				</tr>
				<c:forEach var="program" items="${cncPrograms}">
					<tr>
						<td><c:out value="${program.name}" /></td>
						<td><c:out value="${program.createdTime}" /></td>
						<td><a href="/cncprograms/<c:out value="${program.id}" />">View Program</a></td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	</div>
	<script
		src="//netdna.bootstrapcdn.com/bootstrap/3.1.0/js/bootstrap.min.js"></script>
</body>
</html>