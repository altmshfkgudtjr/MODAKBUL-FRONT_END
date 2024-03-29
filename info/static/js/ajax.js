function A_JAX(url, type, token, data){
    var ajax_;
    var json_data = data;
    if(token == null)
    {
        ajax_ = $.ajax({
            type: type,
            url: url,
            data: json_data,
            dataType : "json",
            success: function(res){
            },
            error: function(res){
            }
        });
    }
    else
    {
        ajax_ = $.ajax({
            type: type,
            url: url,
            headers: {"Authorization": 'Bearer ' + token },
            data: json_data,
            processData: false,
            contentType: false,
            dataType : "json",
            success: function(res){},
            error: function(res){
            }
        });
    }
    return ajax_;
}

