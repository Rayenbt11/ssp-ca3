// This function retrieves an HTML table from the server and appends it to the element 'results'
function draw_table() {
    $("#results").empty();
    // Define a function that retrieves a JSON object from the specified URL
    // The function uses AJAX to send a GET request to the URL, and appends the returned HTML to the element 'results'
    // The cache is disabled to ensure that the most up-to-date data is retrieved
    $.getJSONuncached = function (url) {
        return $.ajax(
            {
                url: url,
                type: 'GET',
                cache: false,
                success: function (html) {
                    $("#results").append(html);
                    // Once the HTML is appended, call the 'select_row' function
                    select_row();
                }
            });
    };
    // Call the function defined above, with the URL '/get/html'
    $.getJSONuncached("/get/html")
};

// This function adds a click event listener to each row in the table with ID 'todoTable'
// When a row is clicked, the 'selected' class is added to it, and removed from all other rows
// The function also calls the 'delete_row' function, passing the section and entree indices of the clicked row
function select_row() {
    $("#todoTable tbody tr[id]").click(function () {
        // Remove the 'selected' class from all rows
        $(".selected").removeClass("selected");
        // Add the 'selected' class to the clicked row

        $(this).addClass("selected");
        // Calculate the section index of the clicked row

        var section = $(this).prevAll("tr").children("td[colspan='3']").length - 1;
        // Calculate the entree index of the clicked row

        var entree = $(this).attr("id") - 1;
        // Call the 'delete_row' function, passing the calculated section and entree indices

        delete_row(section, entree);
    });
};
// This function adds a click event listener to the element with ID 'delete'
// When the element is clicked, the function sends a POST request to the server, with the specified section and entree indices
// The function also calls the 'draw_table' function, with a delay of 1000 milliseconds (1 second)
function delete_row(sec, ent) {
    $("#delete").click(function () {
        $.ajax({
            url: "/post/delete",
            type: "POST",
            data: {
                section: sec,
                entree: ent
            },
            cache: false,
            success: setTimeout(draw_table, 1000)
        });
    });
};

// When the document is ready, call the 'draw_table' function
$(document).ready(function () {
    draw_table();
});