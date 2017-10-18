<?php
//echo date('Y-m-d H:i:s',time());
date_default_timezone_set('PRC');
	$a=date("Y");
  $b=date("m");
  if($b<9)
  $b='0'.$b;
  $c=date("d");
  if($c<9)
  $c='0'.$c;
  $d=date("G");
  if($d<9)
  $d='0'.$d;
  $e=date("i");
  $f=date("s");
  $file_index = $a.$b.$c.$d.$e.$f;
  $file=fopen($_FILES['file']['tmp_name'], "rb");
    $bin=fread($file, 2); //只读2字节
    fclose($file);
    $strInfo =@unpack("c2chars", $bin);
    $typeCode=intval($strInfo['chars1'].$strInfo['chars2']);
    $fileType='';
	echo $typeCode;
    switch($typeCode){
      case 7790:
        $fileType='exe';
      break;
      case 7784:
        $fileType='midi';
      break;
      case 8297:
        $fileType='rar';
      break;
      case 255216:
        $fileType='jpg';
      break;
      case 7173: 
        $fileType='gif';
      break;
      case 6677:
        $fileType='bmp';
      break;
      case 13780:
        $fileType='png';
      break;
	  case 6567:
        $fileType='dwg';
      break;
	  case 13780:
        $fileType='png';
      break;
      default:
        $fileType='unknown'.$typeCode;
      break;
    }
    //Fix
    if($strInfo['chars1']=='-1' && $strInfo['chars2']=='-40'){
      $fileType =  'jpg';
    }
    if($strInfo['chars1']=='-119' && $strInfo['chars2']=='80'){
      $fileType = 'png';
    }


if ( !empty( $_FILES ) ) {
    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
	if (!is_dir( dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $file_index.'/'))
		mkdir(dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $file_index.'/');
		echo dirname( __FILE__ ) . DIRECTORY_SEPARATOR ;
    $uploadPath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $file_index.  DIRECTORY_SEPARATOR . $file_index .  '.' . $fileType;//'.dwg';//$_FILES[ 'file' ][ 'name' ];
	$upload_file = iconv("UTF-8", "GB2312", $uploadPath);
	$i = move_uploaded_file( $tempPath, $upload_file );
	if($i)
	{
		  $answer = array( 'answer' => 'File transfer completed' );
		  $answer['order_no'] = $file_index;
		  $answer['origin_file'] = $_FILES[ 'file' ][ 'name' ];
		  $answer['type'] = $_FILES['file']['type'];
	}
  else{
	  $answer = array( 'answer' => 'File transfer failed' );
  }
    $json = json_encode( $answer );
    echo $json;
} else {
    echo 'No files';
}
?>