<?php

	if (isset($_POST['lid'])) {

		$lid = $_POST['lid'];

		$contents = array (
			"lid" => intval($lid),
			"time_ago" => time(),
		);

		$file = fopen("lid.txt", 'w');
		echo fwrite($file, json_encode($contents));
		fclose($file);

	}

?>