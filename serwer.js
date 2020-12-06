//zmienne, stałe

var express = require("express")
var app = express()
const PORT = process.env.PORT || 3000;
var bodyParser = require("body-parser")
let logged = false
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'))

let userList = [
    {
        id: 1,
        login: "bolek",
        password: "lolek",
        student: "checked",
        age: 11,
        sex: "male"
    },

    {
        id: 2,
        login: "welcome",
        password: "zaq1@WSX",
        student: "",
        age: 6,
        sex: "female"
    },
    {
        id: 3,
        login: "witam",
        password: "szanuje",
        student: "checked",
        age: 16,
        sex: "male"
    },
    {
        id: 4,
        login: "konrad",
        password: "jakub",
        student: "",
        age: 21,
        sex: "male"
    },
    {
        id: 5,
        login: "qwerty",
        password: "qwerty",
        student: "checked",
        age: 18,
        sex: "female"
    },
    {
        id: 6,
        login: "batman",
        password: "robin",
        student: "",
        age: 36,
        sex: "male"
    },
    {
        id: 7,
        login: "bozenka",
        password: "grazynka",
        student: "",
        age: 58,
        sex: "female"
    },
    {
        id: 8,
        login: "elfik",
        password: "zboze",
        student: "",
        age: 20,
        sex: "female"
    }
]

function addUser(login, password, student, age, sex) {
    if (checkOccupation(login)) {
        var user = {
            id: userList.length + 1,
            login: login,
            password: password,
            student: student,
            age: age,
            sex: sex
        }
        userList.push(user)
        return "Witaj " + login + ", twoje konto zostalo utworzone"
    }
    else {
        return "Przykro mi, taki login juz istnieje"
    }
}

function checkOccupation(login) {
    for (var i = 0; i < userList.length; i++) {
        if (login == userList[i].login) {
            return false
        }
    }
    return true
}

function login(res, req) {
    var res = res
    var req = req
    for (var i = 0; i < userList.length; i++) {
        if (req.body.login == userList[i].login) {
            if (req.body.password == userList[i].password) {
                logged = true
                break
            }
            else { break }
        }
    }
    if (logged) { res.redirect("/admin") }
    else { res.sendFile(__dirname + "/static/login-failed.html") }
}

function checkForLogin(boolean, res, granted, pass) {
    if (boolean) { granted(res, pass) }
    else { res.sendFile(__dirname + "/static/admin-denied.html") }
}

function adminGranted(res) {
    res.sendFile(__dirname + "/static/admin-granted.html")
}

function logout(res) {
    logged = false
    res.redirect("/")
}

function sort(res, order) {
    var sort = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Document</title><link rel=\"stylesheet\" href=\"style.css\"></head><body><div id=\"admin\"><a href=\"/sort\">SORT</a><a href=\"/show\">SHOW</a><a href=\"/gender\">GENDER</a></div><form action=\"/sort\" onchange=\"this.submit()\" method=\"POST\"><label for=\"ascending\">ascending</label>"
    if (order == "descending") { sort += "<input type=\"radio\" name=\"order\" value=\"ascending\"></input><br><label for=\"descending\">descending</label><input type=\"radio\" name=\"order\" value=\"descending\" checked></input></form><br><table>" } else { sort += "<input type=\"radio\" name=\"order\" value=\"ascending\" checked></input><br><label for=\"descending\">descending</label><input type=\"radio\" name=\"order\" value=\"descending\"></input></form><br><table>" }
    var placeholder = JSON.parse(JSON.stringify(userList))
    if (order == "descending") {
        var sortedList = placeholder.sort(function (a, b) {
            return parseFloat(b.age) - parseFloat(a.age)
        })
    }
    else {
        var sortedList = placeholder.sort(function (a, b) {
            return parseFloat(a.age) - parseFloat(b.age)
        })
    }
    for (var i = 0; i < sortedList.length; i++) {
        var row = "<tr><td>id: " + sortedList[i].id + "</td><td>user: " + sortedList[i].login + " - " + sortedList[i].password + "</td><td>"
        if (sortedList[i].student == "checked") { row += "student: <input checked disabled type=\"checkbox\"></input>" }
        else { row += "student: <input disabled type=\"checkbox\"></input>" }
        row += "</td><td>wiek: " + sortedList[i].age + "</td><td>sex: " + sortedList[i].sex + "</td></tr>"
        sort += row
    }
    sort += "</table></body></html>"
    res.send(sort)
}

function show(res) {
    var show = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Document</title><link rel=\"stylesheet\" href=\"style.css\"></head><body><div id=\"admin\"><a href=\"/sort\">SORT</a><a href=\"/show\">SHOW</a><a href=\"/gender\">GENDER</a></div><table>"
    for (var i = 0; i < userList.length; i++) {
        var row = "<tr><td>id: " + userList[i].id + "</td><td>user: " + userList[i].login + " - " + userList[i].password + "</td><td>"
        if (userList[i].student == "checked") { row += "student: <input checked disabled type=\"checkbox\"></input>" }
        else { row += "student: <input disabled type=\"checkbox\"></input>" }
        row += "</td><td>wiek: " + userList[i].age + "</td><td>sex: " + userList[i].sex + "</td></tr>"
        show += row
    }
    show += "</table></body></html>"
    res.send(show)
}

function gender(res) {
    var gender = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Document</title><link rel=\"stylesheet\" href=\"style.css\"></head><body><div id=\"admin\"><a href=\"/sort\">SORT</a><a href=\"/show\">SHOW</a><a href=\"/gender\">GENDER</a></div>"
    var male = "<table>"
    var female = "<table>"
    for (var i = 0; i < userList.length; i++) {
        var row = "<tr><td>id: " + userList[i].id + "</td><td>sex: " + userList[i].sex + "</td></tr>"
        if (userList[i].sex == "male") { male += row } else { female += row }
    }
    male += "</table>"
    female += "</table>"
    gender += male
    gender += female
    gender += "</body></html>"
    res.send(gender)
}

// reakcja na szczegolowy adres

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/static/index.html")
})

app.get('/register', function (req, res) {
    res.sendFile(__dirname + "/static/register.html")
})

app.post('/register', function (req, res) {
    res.send(addUser(req.body.login, req.body.password, req.body.student, req.body.age, req.body.sex))
})

app.get('/login', function (req, res) {
    res.sendFile(__dirname + "/static/login.html")
})

app.post('/login', function (req, res) {
    login(res, req)
})

app.get('/admin', function (req, res) {
    checkForLogin(logged, res, adminGranted)
})

app.get('/sort', function (req, res) {
    checkForLogin(logged, res, sort)
})

app.post('/sort', function (req, res) {
    checkForLogin(logged, res, sort, req.body.order)
})

app.get('/show', function (req, res) {
    checkForLogin(logged, res, show)
})

app.get('/gender', function (req, res) {
    checkForLogin(logged, res, gender)
})

app.get('/logout', function (req, res) {
    logout(res)
})

//nasłuch na określonym porcie

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})