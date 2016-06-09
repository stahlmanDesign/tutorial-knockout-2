// Class to represent a row in the seat reservations grid
function SeatReservation(name, initialMeal) {
    var self = this;
    self.name = name;
    self.meal = ko.observable(initialMeal);
    self.formattedPrice = ko.computed(function() {
        var price = self.meal().price;
        return price ? "€" + price.toFixed(2) : "None";
    })
}

// Overall viewmodel for this screen, along with initial state
function ReservationsViewModel() {
    var self = this;

    // Non-editable catalog data - would come from the server
    self.availableMeals = [{
        mealName: "Standard (sandwich)",
        price: 0
    }, {
        mealName: "Premium (lobster)",
        price: 34.95
    }, {
        mealName: "Ultimate (whole zebra)",
        price: 290
    }];

    // Editable data
    self.seats = ko.observableArray([
        new SeatReservation("Steve", self.availableMeals[0]),
        new SeatReservation("Bert", self.availableMeals[1])
    ]);
    this.addSeat = function() {
        var rnd = Math.floor(Math.random() * self.availableMeals.length)
        self.seats.push(new SeatReservation(getName(3, 12, null, null), self.availableMeals[rnd]));
    }
    this.removeSeat = function(seat) {
        self.seats.remove(seat);
    }
    self.totalSurcharge = ko.computed(function() {
        var total = 0;
        for (var i = 0; i < self.seats().length; i++) {
            total += self.seats()[i].meal().price;
            // using () gets current value of observables
        }
        return total;
    });
}

ko.applyBindings(new ReservationsViewModel());


// random name generator
// http://leapon.net/files/namegen.html
// http://leapon.net/en/random-name-generator-javascript

function rnd(minv, maxv) {
    if (maxv < minv) return 0;
    return Math.floor(Math.random() * (maxv - minv + 1)) + minv;
}

function getName(minlength, maxlength, prefix, suffix) {
    prefix = prefix || '';
    suffix = suffix || '';
    //these weird character sets are intended to cope with the nature of English (e.g. char 'x' pops up less frequently than char 's')
    //note: 'h' appears as consonants and vocals
    var vocals = 'aeiouyh' + 'aeiou' + 'aeiou';
    var cons = 'bcdfghjklmnpqrstvwxz' + 'bcdfgjklmnprstvw' + 'bcdfgjklmnprst';
    var allchars = vocals + cons;
    //minlength += prefix.length;
    //maxlength -= suffix.length;
    var length = rnd(minlength, maxlength) - prefix.length - suffix.length;
    if (length < 1) length = 1;
    //alert(minlength + ' ' + maxlength + ' ' + length);
    var consnum = 0;
    //alert(prefix);
    /*if ((prefix.length > 1) && (cons.indexOf(prefix[0]) != -1) && (cons.indexOf(prefix[1]) != -1)) {
    	//alert('a');
    	consnum = 2;
    }*/
    if (prefix.length > 0) {
        for (var i = 0; i < prefix.length; i++) {
            if (consnum == 2) consnum = 0;
            if (cons.indexOf(prefix[i]) != -1) {
                consnum++;
            }
        }
    } else {
        consnum = 1;
    }

    var name = prefix;

    for (var i = 0; i < length; i++) {
        //if we have used 2 consonants, the next char must be vocal.
        if (consnum == 2) {
            touse = vocals;
            consnum = 0;
        } else touse = allchars;
        //pick a random character from the set we are goin to use.
        c = touse.charAt(rnd(0, touse.length - 1));
        name = name + c;
        if (cons.indexOf(c) != -1) consnum++;
    }
    name = name.charAt(0).toUpperCase() + name.substring(1, name.length) + suffix;
    return name;
}

function send() {
    //$('names').innerHTML = 'Tunggu bentar yah, lagi bikin namanya...';
    var minchar = parseInt($('minchar').value);
    var maxchar = parseInt($('maxchar').value);
    var n1col = parseInt($('n1col').value);
    var nnames = parseInt($('nnames').value);
    var prefix = $('prefix').value;
    var suffix = $('suffix').value;
    if ((minchar < 0) || (minchar > maxchar) || (maxchar < 0) || (maxchar > 100) || (n1col < 0) || (n1col > 500) || (nnames < 0) || (nnames > 5000)) {
        $('names').innerHTML = '<big>Please enter a more sensible input...<\/big>';
        return;
    }
    if (prefix.length + suffix.length >= maxchar) {
        $('names').innerHTML = '<big>Prefix + suffix length is greater or equal to maximum length...<\/big>';
        return;
    }
    var s = '<big>Displaying ' + nnames + ' random names...<\/big><br /><pre>';
    for (i = 0; i < nnames; i++) {
        if ((i % n1col) == 0) s += '<br />';
        var name = getName(minchar, maxchar, prefix, suffix);
        var padding = '';
        for (var j = 0; j < maxchar - name.length + 1; j++) padding += ' ';
        s += name + padding;

    }
    $('names').innerHTML = s + '<\/pre>';
    return false;
}