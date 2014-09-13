<h1><i class="fa fa-slack"></i> Slack notifications</h1>
<hr />
<p>Setup a <a href="http://slack.com" target="_blank">Slack</a> account and configure an Incoming WebHook from the Integrations section.
<br>
<form>
	<div class="form-group">
		<label for="domain">Domain</label><br />
		<input type="text" data-field="slack:domain" title="Domain" class="form-control" placeholder="Domain is the first part of your .slack.com">
	</div>
	<div class="form-group">
		<label for="token">Token</label><br />
		<input type="text" data-field="slack:token" title="Token" class="form-control" placeholder="Your integration Token generated by slack">
	</div>
	<div class="form-group">
		<label for="channel">Channel</label><br />
		<input type="text" data-field="slack:channel" title="Channel" class="form-control" placeholder="Slack channel name. eg. #general">
	</div>
	<div class="form-group">
		<label for="postlength">Notification maximum characters</label><br />
		<input type="number" data-field="slack:post:maxlength" title="Max length of posts before trimming." class="form-control" style="max-width: 240px;" placeholder="Leave blank to send full post.">
	</div>
</form>

<button class="btn btn-primary" type="button" id="save">Save</button>

<script>
	require(['forum/admin/settings'], function(Settings) {
		Settings.prepare();
	});
</script>