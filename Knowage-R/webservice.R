library("jsonlite")
library("base64enc")

#' @post /img
function(dataset, dataset_name=NULL, script, output_variable){
  env <- new.env()
  if (!is.null(dataset_name)) {
    script <- gsub(dataset_name,"df_",script)
    env$df_ <- as.data.frame(fromJSON(dataset))
  }
  eval(parse(text=script), envir = env)
  enc_img <- base64encode(output_variable)
  if (file.exists(output_variable))
    file.remove(output_variable)
  enc_img
}

#' @post /html
function(dataset, dataset_name=NULL, script, output_variable){
  env <- new.env()
  if (!is.null(dataset_name)) {
    script <- gsub(dataset_name,"df_",script)
    env$df_ <- as.data.frame(fromJSON(dataset))
  }
  eval(parse(text=script), envir = env)
  html  <- read.file(output_variable)
  if (file.exists(output_variable))
    file.remove(output_variable)
  html
}

#' @get /libraries
function(){
  str(allPackages <- installed.packages(.Library, priority = "high"))
  lib_matrix <- allPackages[, c(1,3:5)]
  lib_info <- lib_matrix[,c(1,2)]
  lib_info
}
