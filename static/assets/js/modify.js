/** for sorting select options */
$.fn.sortOptions = function() {
    $(this).each(function() {
        var op = $(this).children("option");
        op.sort(function(a, b) {
            return Number($(a).attr('data-ordering')) > Number($(b).attr('data-ordering')) ? 1 : -1;
        })
        return $(this).empty().append(op);
    });
}

$(function () {
    $(document).on('change', '#uni-select', function () {
        if ($(this).val() == 'Other') {
            $('#university-name-manual').removeClass('none');
        }
        else {
            $('#university-name-manual').addClass('none');
        }
    });

    $(document).on('change', '#study-select', function () {
        if ($(this).val() == 'Other') {
            $('#study-name-manual').removeClass('none');
        }
        else {
            $('#study-name-manual').addClass('none');
        }
    });

    /** required asterisk */
    $('.required-v2 input, .required-v2 select, .required-v2 textarea').each(function () {
        if ($(this).attr('required') === 'required') {
            $(this).before('<span class="asterisk">*</span>');
        }

    });

    var selects = $("select").not('.skip-sorting');

    // selects.each(function () {
    //     // Get the current <select>
    //     var select = $(this);

    //     // Get the <option> elements and sort them by text
    //     var options = select.find("option");
    //     options.sort(function (a, b) {
    //         return $(a).text().localeCompare($(b).text());
    //     });

    //     // Clear the <select>
    //     select.empty();

    //     // Append the sorted options back to the <select>
    //     select.append(options);
    // });

    $("form").submit(function () {
        $(this).find("input[type=submit]").attr("disabled", true);
        return true;
    });
});



$('.sort-options-data-ordering').each(function() {
    $(this).sortOptions();
});

function confirmTrans() {
    if (typeof def_lang !== 'undefined' && def_lang == 'ar') {
        return confirm('هل انت متأكد ؟ ');
    }
    else {
        return confirm('Are You Sure ?');
    }
}



function confirmDeletePost(elm) {
    /** make confirm link empty */
    $('#confirm-delete-post-modal .post-confirm').attr('href', '#');

    let title = $(elm).attr('data-title');
    let type = $(elm).attr('data-type');
    let confirm_url = $(elm).attr('data-href');
    $('#confirm-delete-post-modal .post-title').text(title);
    $('#confirm-delete-post-modal .post-type').text(type);
    $('#confirm-delete-post-modal .post-confirm').attr('href', confirm_url);
    $('#confirm-delete-post-modal').modal('show');
}


function noteModal(elm) {
    /** make confirm link empty */
    $('#note-modal form').attr('action', '#');

    let submit_url = $(elm).attr('data-submit');
    $('#note-modal form').attr('action', submit_url);
    let value = $(elm).parent().find('textarea').val();
    $('#note-modal form textarea').val(value);

    $('#note-modal').modal('show');
}

function jobGuideFilter(elm) {
    var jobs_guide_id = $(elm).val();
    window.location.href = url + '/jobs-guide/' + jobs_guide_id + '?type=hard_skills';
}


async function changeCountry(elm, city_class) {
    try {
        var country_id = $(elm).val();
        var ajax_url = url + "/get-cities";
        var ajax_method = 'GET';
        var data = { conditions: { country_id: country_id } };
        var res = await doAjax(ajax_url, ajax_method, data);
        var cities = res.cities;
        /** set html */
        let options = '<option value="">...</option>';
        cities.forEach(function (city, index) {
            options += '<option value="' + city.id + '">' + city.name + '</option>';
        });
        $('.' + city_class).html(options);
        /** end set html */
    }
    catch (e) {
        // console.log(e.message);
        alert('error');
    }
}

async function checkDiscountCode(elm, discount_code_input_class, discount_val_output_class) {
    try {
        var ajax_url = url + "/check-discount-code";
        var ajax_method = 'GET';
        var data = {
            discount_code: $('.' + discount_code_input_class).val(),
            price: $(elm).attr('price')
        };
        var res = await doAjax(ajax_url, ajax_method, data);
        /** set value */
        if (discount_val_output_class == 'print-price')
            $('.' + discount_val_output_class).val(res.print_output_msg);
        else
            $('.' + discount_val_output_class).val(res.output_msg);
        /** end set value */
        if (!res.status) {
            alert(res.msg);
        }

    }
    catch (e) {
        console.log(e.message);
        alert('error');
    }
}

function doAjax(ajax_url, ajax_method, data = {}, headers = {}) {
    return $.ajax({
        type: ajax_method,
        url: ajax_url,
        dataType: "json",
        headers: headers,
        data: data,
        processData: data instanceof FormData ? false : true,
        contentType: false,
        success: function (response) {

        },
        error: function (response) {
            if (response.status == 422) {
                $.each(response.responseJSON.errors, function (key, value) {
                    showError(value);
                });
            } else {
                showError(response.message);
                showError(response.responseJSON.message);
            }
        }
    });
}

function doAjaxJson(ajax_url, ajax_method, data = {}, headers = {}) {
    return $.ajax({
        type: ajax_method,
        url: ajax_url,
        dataType: "json",
        headers: headers,
        data: data,
        success: function (response) {

        },
        error: function (response) {
            if (response.status == 422) {
                $.each(response.responseJSON.errors, function (key, value) {
                    showError(value);
                });
            } else {
                showError(response.message);
                showError(response.responseJSON.message);
            }
        }
    });
}

function toggleTheme(uri, method, data, headers) {
    doAjax(uri, method, data, headers).then(res => {
        window.location.reload();
    });
}

$("#addToFav").click(function() {
    let url = $(this).attr('uri');
    let token = $(this).attr('token');
    let data = {data:itemToTakeActionList};
    // data = JSON.stringify(data)
    let headers = {
        'X-CSRF-TOKEN': token
    }
    doAjaxJson(url, 'POST', data, headers).then(res => {
        Swal.fire(
            res.title,
            res.message,
            res.name
          )
    });
});

$(".takeReqAction").click(function() {
    let url = $(this).attr('uri');
    let token = $(this).attr('token');
    let data = {data:itemToTakeActionList};
    let headers = {
        'X-CSRF-TOKEN': token
    }
    doAjaxJson(url, 'POST', data, headers).then(res => {
        Swal.fire(
            res.title,
            res.message,
            res.name
          )
          setTimeout(function() {
            window.location.reload();
          },2000)
    });
});


var itemToTakeActionList = [];

function addToTakeAction(el) {
    let checked = $(el).prop('checked');
    let id = $(el).val();
    let exist = false;
    itemToTakeActionList.forEach((el, i) => {
        if(el.id == id) {
            itemToTakeActionList[i].checked = checked ? 1 : 0;
            exist = true;
        }
    })
    if(!exist) {
        itemToTakeActionList.push({id: id, checked: checked ? 1 : 0});
    }
}



function checkAllToTakeAction(el) {
    let checked = $(el).prop('checked');
    $(".actionCheck").each(function(i, el) {
        $(el).prop('checked', checked);
        addToTakeAction(el);
    });
}

