# Bot node Heroku by Chuy Hiep

Code demo 1 [botcamxuc.net](http://botcamxuc.net/).

Code demo 2 [chuyhiep.herokuapp.com](https://chuyhiep.herokuapp.com/).

Hỗ trợ thêm tại facebook [Chụy Hiệp](https://fb.com/itvn90).

## Cài đặt và chạy thử tại máy cá nhân
Bạn cần có 1 tài khoản tại [Heroku CLI](https://cli.heroku.com/).

Bạn cần cài đặt [Node.js](http://nodejs.org/)  và  [Heroku CLI](https://cli.heroku.com/) và [Git](https://git-scm.com/downloads/).

Mở cmd chạy command sau:
```sh
$ git clone https://github.com/hjephb90/BOT-ChuyHiep.git # lấy bản code mẫu
$ cd BOT-ChuyHiep
$ npm install
$ npm start
```

Ứng dụng sẽ chạy tại [localhost:3456](http://localhost:3456/).

## Đưa code lên Heroku

Mở cmd chạy command sau:
```
$ heroku login # nhập email và mật khẩu tài khoản heroku 
$ heroku create myapp # myapp là tên app tại heroku
$ git push heroku master
$ heroku open
```

## Tắt bật app
```
$ heroku ps:scale web=1 # Tắt app
$ heroku ps:scale web=0 # Bật app
# Lưu ý các lưu trữ cục bộ trên heroku sẽ mất khi bạn tắt app hoặc resart app
```

## Tài liệu tham khảo

Bạn có thể tìm thêm các hướng dẫn của heroku:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
