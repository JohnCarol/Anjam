
function getCollName(sel) {
  const collName = sel.options[sel.selectedIndex].text;
  document.getElementById('collName').value = collName;	
}

$('#confirm-delete').on('click', '.btn-ok', function(e) {

  var $modalDiv = $(e.delegateTarget);
  var id = $(this).data('recordId');
	
   $modalDiv.addClass('loading');
   $.post(id).then(function() {
	 let itemToDelete = id.replace("?_method=DELETE","");
	   console.log(itemToDelete);
	  
     $modalDiv.modal('hide').removeClass('loading');
	   
	document.getElementById(itemToDelete).remove()
	 //let $itemToDelete = $(itemToDelete);	   	 
   });
});

// Bind to modal opening to set necessary data properties to be used to make request
$('#confirm-delete').on('show.bs.modal', function(e) {
  var data = $(e.relatedTarget).data();
  $('.title', this).text(data.recordTitle);
  $('.btn-ok', this).data('recordId', data.recordId);
});