<?php

	$domainCheck = 'tve.112.2o7.net';
	$fileContent = null;
	$parsedContent = null;
	$formErrors = array();
	$outputCSV = false;
	$trackedEntries = array();
	$formattedEntries = array();
	$columns = array();

	if($_FILES){

		if($_FILES['har_file']['error'] > 0){
			$formErrors[] = $_FILES['har_file']['error'];
		} elseif(!$fileContent = file_get_contents($_FILES['har_file']['tmp_name'])){
			$formErrors[] = 'The uploaded file is empty.';
		} 

		if(!$parsedContent = json_decode($fileContent, true)){

			if(json_last_error() == JSON_ERROR_SYNTAX){
				$fileContent = preg_replace('/.+?({.+}).+/','$1',$fileContent);
				$parsedContent = json_decode($fileContent, true);
			}

		}

		if(!$parsedContent){
			$formErrors[] = 'There was an error parsing the file.';
		}

		if(!$formErrors){
			foreach($parsedContent['log']['entries'] as $entry){
				if(strpos($entry['request']['url'], $domainCheck) !== false && $entry['request']['queryString']){
					$entryFmt = array(
						'Time' => $entry['startedDateTime']
					);
					foreach($entry['request']['queryString'] as $qs){
						if(!in_array($qs['name'], $columns)){
							$columns[] = $qs['name'];
						}

						$entryFmt[$qs['name']] = $qs['value'];
					}
					$trackedEntries[] = $entryFmt;
				}
			}

			if($trackedEntries){
				sort($columns);
				foreach($trackedEntries as $qs){
					$formattedEntry = array(
						'Time' => $qs['Time']
					);
					foreach($columns as $key){
						$formattedEntry[$key] = isset($qs[$key]) ? $qs[$key] : null;
					}
					$formattedEntries[] = $formattedEntry;
				}

				$outputCSV = true;
			}
		}
	}

	if(! $outputCSV):
?>
<!DOCTYPE html>
<html>
	<head>
		<title>HAR Parser</title>
	</head>
	<body>
		<form id="fileUpload" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" enctype="multipart/form-data">
			<h1>Upload HAR File</h1>
			<?php if($formErrors): ?>
			<ul class="errors">
				<?php foreach($formErrors as $err): ?>
				<li><?php echo $err; ?></li>
				<?php endforeach; ?>
			</ul>
			<?php endif; ?>
			<div>
				<input type="file" name="har_file" /> <input type="submit" value="upload" />
			</div>
		</form>
	</body>
</html>
<?php 
	
	else: 

		$output = fopen("php://output",'w') or die("Can't open php://output");
		header("Content-Type:application/csv"); 
		header("Content-Disposition:attachment;filename=" . date('Y-m-d') . ".csv"); 
		array_unshift($columns, 'Time');
		fputcsv($output, $columns);
		foreach($formattedEntries as $entry) {
		    fputcsv($output, $entry);
		}
		fclose($output) or die("Can't close php://output");

	endif; 

?>