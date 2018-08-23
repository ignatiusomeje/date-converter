let token;
$(function(){
   
  $('#submitLogin').click(function(e){
    e.preventDefault();
    var data = $("#login_form :input").serializeArray()

    $.ajax({
      url: 'http://localhost:3000/login',
      type:'post',
      data: data,
      success: function(user){
          localStorage.setItem('converter',user.tokens.token);
        token = localStorage.getItem('converter');
        $("#pass, #user").val('');
        window.location.href = 'http://localhost:3000/query';
      },
      error: function(error){
        swal("Login!", "Unsuccessful", "error")
      }
    })
  });
  
  $('#submitSignup').click(function(e){
    e.preventDefault();
    var data = $('#signUp_form :input').serializeArray();

    $.ajax({
      url: 'http://localhost:3000/user',
      type: 'post',
      data : data,
      success: function(person){
              localStorage.setItem('converter',person.tokens.token);
        token = localStorage.getItem('converter')
        $("#password, #username").val('');
        window.location.href = 'http://localhost:3000/query';
      },
      error: function(error){
        $("#password, #username").val('');
        swal("Sign Up!", "Unsuccessful", "error")
      },
    });
  });
  
  $('#convert').click(function(e){
    e.preventDefault();
    token = localStorage.getItem('converter');
    let number = $('#number').val();
    let unit = $('#unit').val();
    $.ajax({
      url: 'http://localhost:3000/query',
      data: {number,unit},
      type: 'post',
      beforeSend: function(jqXHR){
        jqXHR.setRequestHeader('x-auth', token)
      } ,
    success: function(result){
      $('#results').empty()
      var ul = $('<ul></ul>');
        result.results.forEach(element => {
          delete element._id
          Object.keys(element).forEach(key => {
            ul.append('<li> ' +'<b>' + key + '</b>' + ': ' + element[key] + ' </li>');
          })
        });
      $('#results').append(ul)
      },
    error: function(error){
      $('#results').empty()
      $('#results').append('<b style ="color:red;">Unable to get your result</b>')
  }
});
  });

  $('#history').click(function(e){
    e.preventDefault();
    $.ajax({
      url: 'http://localhost:3000/history',
      type: 'get',
      beforeSend: function(jqXHR){
        jqXHR.setRequestHeader('x-auth',localStorage.getItem('converter'));
      },
      success: function(result){
        $('#results').empty();
        let table = $("<table></table>")
        result.filter(res => {
          res.results.forEach(element => {
            delete element._id

            Object.keys(element).forEach(key =>{
              table.append('<tr><td> ' +'<b>' + key + '</b>' + ': ' + element[key] + ' </td></tr><hr>');
            })
          })
        })
        $('#results').append(table);
      },
      error: function(error){
        $('#results').empty();
        $('#results').append('<b style = "color:red;">Unable to get your history</b>')
      }
    })
  })

  $('#signOut').click(function(e){
    e.preventDefault();
    $.ajax({
      url:'http://localhost:3000/logout',
      type: 'delete',
      beforeSend: function(jqXHR){
        jqXHR.setRequestHeader('x-auth',localStorage.getItem('converter'));
      },
      success: function(logout){
        swal("LogOut!", "Successful", "success");
        window.location.href = 'http://localhost:3000'
      },
      error: function(error){
        swal("LogOut!", "Unsuccessful", "error")
      }
    })
    localStorage.removeItem('converter')
  })
})
