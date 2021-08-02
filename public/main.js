const socket = io('http://localhost:3000')
var sendMesUser
// socket.auth = { 
//     token: getCookie('token'),
//     username: getCookie('username') 
// };
//...
// socket.on('session', (session) => {
//     localStorage.setItem("sessionID", session);
// })

socket.emit('client-send-token', {
    token: getCookie('token'),
    username: getCookie('username')
})

socket.on('server-send-users', (users) => {
    $('.vertical-menu').html('')
    $('.vertical-menu').append('<a href="#" class="active">Users</a>')
    users.forEach(user => {
        // Tắt event click
        $('body').off('click','.'+ user +'')
        $('.vertical-menu').append('<a href="#" class="'+ user +'">'+ user +'</a>')
        // Thêm event click
        $('body').on('click','.'+ user +'',function(){
            sendMesUser = user
        })
    });
})

socket.on('server-send-msg-for-me', (data) => {
    var item = $(`
          <article class="msg-container msg-self" id="msg-0">
            <div class="msg-box">
                <div class="flr">
                    <div class="messages">
                        <p class="msg" id="msg-2">
                            ${data.message}
                        </p>
                    </div>
                    <span class="timestamp"><span class="username">Me</span>
                </div>
                <img class="user-img" id="user-0" src="//gravatar.com/avatar/56234674574535734573000000000001?d=retro" />
            </div>
          </article>
      `)
      $('.chat-window').append(item)
      sendMesUser = data.to
})

socket.on('server-send-message', (data) => {
    var item = $(`
        <article class="msg-container msg-remote" id="msg-0">
          <div class="msg-box">
              <img class="user-img" id="user-0" src="//gravatar.com/avatar/00034587632094500000000000000000?d=retro" />
              <div class="flr">
                  <div class="messages">
                      <p class="msg" id="msg-0">
                          ${data.message}
                      </p>
                  </div>
                  <span class="timestamp"><span class="username">${data.from}</span>
              </div>
          </div>
        </article>
    `)
    $('.chat-window').append(item)

    // auto sua senduser thanh nguoi gui
    sendMesUser = data.from
    // $('#listMessages').append('<div class="you">'+ data.from +': '+ data.message +'</div><br><br>')
})



$(document).ready(() => {
    $('#currentUser').html(getCookie('username'))


    $('#btnSendMessage').click(() => {
      socket.emit('user-send-message', 
      {
          to: sendMesUser,
          message: $('#txtMessage').val()
      })

      // $('#listMessages').append('<div class="me">'+ $('#txtMessage').val() +'</div><br><br>')
      $('#txtMessage').val('');
    })
})

$('.chat-input input').keyup(function(e) {
	if ($(this).val() == '')
		$(this).removeAttr('good');
	else
		$(this).attr('good', '');
});

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}






//api

var maxPage = 1;
        var currentPage = maxPage;

// event scroll down
        $(window).scroll(function() {
            if($(window).scrollTop() + $(window).height() == $(document).height()) {
                loadPage(currentPage - 1);
            }
        });


// load truoc page 1
        $(document).ready(function () {
            $("#auto").trigger('click');
        });

        function getCookie(cname) {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
            }
            return "";
        }
        
// phan trang
        function abc(abc){
            alert(abc)
        }

        
        function loadPage(page){

            if(page < 1){ 
                return;
            }

            currentPage = page;
            console.log(currentPage);

            if(page > maxPage){
                maxPage = page;
            }
            
            
            $.ajax({
                url: '/api/newsfeed?page=' + page,
                type: 'GET'
            })
            .then(data => {
                console.log(data);
                var userName = getCookie('username');
                for(let i = data.newsfeed.length - 1 ; i >= 0; i--){
                    var item;
                    var idOnClick = data.newsfeed[i]._id;
                    if(data.newsfeed[i].url){
                        item = $(`
                            <div class="card mt-4" style="width: 40rem; margin-left: 200px;" id="${data.newsfeed[i]._id}cmt">
                            <img src="/image/${data.newsfeed[i].url}" class="card-img-top" alt="..." width="500px" height="500px">
                            <div class="card-body">
                            <h5 class="card-title">${data.newsfeed[i].user}</h5>
                            <p class="card-text">${data.newsfeed[i].content}</p>
                            <a href="#" id="${data.newsfeed[i]._id}" class="btn btn-primary" onclick="likeStatus(\'${data.newsfeed[i]._id}\')">Like<h3>${data.newsfeed[i].like.length}</h3></a>
                            
                            <div class="row g-3 mt-4">
                                <div class="col-auto">
                                    <label for="inputPassword2" class="visually-hidden">Comment</label>
                                    <input type="text" class="form-control" placeholder="Comment" style="width: 450px;" id="cmt${data.newsfeed[i]._id}">
                                </div>
                                <div class="col-auto">
                                    <button type="submit" class="btn btn-primary mb-3" onclick="cmtStatus(\'${data.newsfeed[i]._id}\')">Comment</button>
                                </div>
                            </div>

                            <a href="#" id="viewcmt${data.newsfeed[i]._id}" onclick="getComment(\'${data.newsfeed[i]._id}\')">View Comment</a>
                            </div>
                            </div>
                        `)
                    }
                    else{
                        item = $(`
                            <div class="card mt-4" style="width: 40rem; margin-left: 200px;" id="${data.newsfeed[i]._id}cmt">
                            <div class="card-body">
                            <h5 class="card-title">${data.newsfeed[i].user}</h5>
                            <p class="card-text">${data.newsfeed[i].content}</p>
                            <a href="#" id="${data.newsfeed[i]._id}" class="btn btn-primary" onclick="likeStatus(\'${data.newsfeed[i]._id}\')">Like<h3>${data.newsfeed[i].like.length}</h3></a>

                            <div class="row g-3 mt-4">
                                <div class="col-auto">
                                    <label for="inputPassword2" class="visually-hidden">Comment</label>
                                    <input type="text" class="form-control" placeholder="Comment" style="width: 450px;" id="cmt${data.newsfeed[i]._id}">
                                </div>
                                <div class="col-auto">
                                    <button type="submit" class="btn btn-primary mb-3" onclick="cmtStatus(\'${data.newsfeed[i]._id}\')">Comment</button>
                                </div>
                            </div>

                            <a href="#" id="viewcmt${data.newsfeed[i]._id}" onclick="getComment(\'${data.newsfeed[i]._id}\')">View Comment</a>
                            </div>
                            </div>
                        `)
                    }

                    
                    // $('.btn-post').attr('onclick', 'abc()');
                    // $('.btn-post').click(abc(idOnClick));
                    $('#newsfeed').append(item);
                    
                }
            })
            .catch(error => {
                console.log(error);
                console.log('api error');
            })
        }

        

        function likeStatus(idOnClick){
// disable auto scroll top https://stackoverflow.com/questions/26282932/prevent-auto-scrolling-down-jquery
            event.preventDefault();
            $.ajax({
            url: '/api/like/' + idOnClick +'/' + getCookie('username'), 
            type: 'GET',
            })
            .then(data => {
                console.log(data);
                if(data.message != "fail"){
                    $('#'+ idOnClick +'').html('Like<h3>'+ data.like +'</h3>');
                }
            })
            .catch(error => {
                console.log(error);
            })
        }

        function cmtStatus(idOnClick){
            event.preventDefault();
            // $('#'+ idOnClick +'' + 'cmt').append('<input type="text" class="form-control" id="comment" placeholder="Comment">')

            $.ajax({
            url: '/api/comment/' + idOnClick +'/' + getCookie('username'),
            type: 'POST',
            data: {
                comment: $('#cmt'+idOnClick+'').val()
            }
            })
            .then(data => {
                console.log(data);
                if(data != "comment fail"){
                    $('#viewcmt' + idOnClick +'').append('<input type="text" class="form-control" placeholder="'+ $('#cmt'+idOnClick+'').val() +'">')
                    $('#cmt'+ idOnClick +'').val('')
                }
            })
            .catch(error => {
                console.log(error);
            })
        }


        var pageComment = 0;
        var pageCommentMax = 1;
        var currentID = "quyetsama";

        function getComment(idOnClick){

            event.preventDefault();
            console.log("getcmt", pageComment, pageCommentMax);

            
            if(currentID != idOnClick){
                currentID = idOnClick;
                pageComment = 0;
            }

            pageComment++;

            if(pageComment > pageCommentMax){
                return;
            }

            
            // $('#'+ idOnClick +'' + 'cmt').append('<input type="text" class="form-control" id="comment" placeholder="Comment">')

            $.ajax({
            url: '/api/comment/' + idOnClick + '?page=' + pageComment,
            type: 'GET'
            })
            .then(data => {
                console.log(data);
                if(data.message != "fail"){
                    pageCommentMax = data.total;
                    for(var i = 0 ;i < data.comment.length; i++){
                        $('#viewcmt' + idOnClick +'').append('<input type="text" class="form-control" placeholder="'+ data.comment[i].comment +'">')
                    }
                    
                }
            })
            .catch(error => {
                console.log(error);
            })
        }