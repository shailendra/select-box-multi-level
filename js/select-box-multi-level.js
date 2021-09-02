function setupSelectBox(propsParent) {
   var holders = $(propsParent.holder);
   holders.each(function (index) {
      var props = JSON.parse(JSON.stringify(propsParent));
      var resultOnLastSelection = props.resultOnLastSelection == undefined ? true : props.resultOnLastSelection;
      var holderDiv = $(this);
      var bikeModelDivArr = holderDiv.find(".eachDataDiv");
      function getFilteredData(props) {
         var dataType = props.dataType
         var filterDataType = props.filterDataType;
         var filterDataStr = "";
         for (var key in filterDataType) {
            var value = filterDataType[key];
            filterDataStr += ('[data-' + key)
            if (value != "") {
               filterDataStr += ('="' + value + '"');
            }
            filterDataStr += ']';
         }
         var list = holderDiv.find('.dataListHolder ' + filterDataStr);
         props.divList = list;
         for (var key in filterDataType) {
            var value = filterDataType[key];
            var arr = props[key + "SortArr"] = [];
            list.each(function () {
               var div = $(this);
               var data = div.data();
               var isFound = false;
               var value = data[key];
               for (var i = 0; i < arr.length; i++) {
                  if (arr[i] == value) {
                     isFound = true;
                  }
               }
               if (isFound == false) {
                  arr.push(value)
               }
            })
         }
         return props;
      }
      function setSelectBox(props) {
         var curDataType = props.dataType;
         var selectBox = holderDiv.find('select[data-type="' + curDataType + '"]');
         var filterObj = props.filterObj;
         selectBox.find("option").each(function (index) {
            index !== 0 ? $(this).remove() : "";
         })
         var options = selectBox.find("option");
         var sortArray = filterObj[curDataType + 'SortArr'];
         function addOption() {
            var ele = sortArray[i];
            var optionTag = $('<option value="' + ele + '">' + ele + '</option>');
            selectBox.append(optionTag);
         }
         for (var i = 0; i < sortArray.length; i++) {
            addOption(i);
         }
         selectBox.unbind('change select');
         selectBox.bind('change select', function (e) {
            var selectedValue = $(e.target).val();
            if (props.onSelect) {
               props.onSelect({ selectedValue: selectedValue })
            }
         });
      }
      //---------------------------------------------
      function showDataInfoAsPerFilter() {
         var obj = getFilteredData({
            filterDataType: filterDataType
         })
         obj.divList.addClass("show");
      }
      //---------------------------------------------
      var allSelectBox = holderDiv.find("select");
      var filterDataType = {};
      allSelectBox.each(function (index) {
         var selectBox = $(this);
         var data = selectBox.data();
         var dataType = data.type;
         filterDataType[dataType] = "";
         data.clearFilterData = function () {
            filterDataType[dataType] = "";
         }
         data.setSelectBox = function () {
            selectBox.addClass("show");
            setSelectBox({
               dataType: dataType,
               filterObj: getFilteredData({
                  filterDataType: filterDataType
               }),
               onSelect: function (props) {
                  filterDataType[dataType] = props.selectedValue;

                  bikeModelDivArr.removeClass("show");
                  for (var i = (index + 1); i < allSelectBox.length; i++) {
                     var tempSelect = $(allSelectBox[i]);
                     tempSelect.removeClass("show");
                     tempSelect.data().clearFilterData();
                  }
                  if (resultOnLastSelection == false) {
                     showDataInfoAsPerFilter();
                  }
                  if (props.selectedValue == "") {
                     return;
                  }
                  var tempNextSelectBox = allSelectBox[index + 1];
                  if (tempNextSelectBox) {
                     var nextSelectBox = $(tempNextSelectBox);
                     nextSelectBox.addClass("show");
                     nextSelectBox.data().setSelectBox()
                  } else {
                     //--- last selection of select box
                     showDataInfoAsPerFilter();
                  }

               }
            });
            if (props.default && props.default) {
               for (var key in props.default) {
                  var tempVal = props.default[key];
                  if (dataType == key) {
                     var option = selectBox.find('option[value="' + tempVal + '"]');
                     if (option.length > 0) {
                        selectBox.find("option").attr("selected", false);
                        option.attr("selected", true);
                        selectBox.trigger("change");
                     }
                     delete props.default[key];
                  }
               }
            }
         }
      })
      $(allSelectBox[0]).data().setSelectBox();
   })
}
