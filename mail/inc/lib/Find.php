<?php
//
// +----------------------------------------------------------------------+
// | PHP Version 4                                                        |
// +----------------------------------------------------------------------+
// | Copyright (c) 1997-2005 The PHP Group                                |
// +----------------------------------------------------------------------+
// | This source file is subject to version 2.02 of the PHP license,      |
// | that is bundled with this package in the file LICENSE, and is        |
// | available at through the world-wide-web at                           |
// | http://www.php.net/license/2_02.txt.                                 |
// | If you did not receive a copy of the PHP license and are unable to   |
// | obtain it through the world-wide-web, please send a note to          |
// | license@php.net so we can mail you a copy immediately.               |
// +----------------------------------------------------------------------+
// | Author: Sterling Hughes <sterling@php.net>                           |
// +----------------------------------------------------------------------+
//
// $Id: Find.php,v 1.21 2005/09/20 11:33:15 techtonik Exp $
//

require_once 'PEAR.php';

define('FILE_FIND_VERSION', '@package_version@');


/**
*  Commonly needed functions searching directory trees
*
* @access public
* @version $Id: Find.php,v 1.21 2005/09/20 11:33:15 techtonik Exp $
* @package File
* @author Sterling Hughes <sterling@php.net>
*/
class File_Find
{
    /**
     * internal dir-list
     * @var array
     */
    var $_dirs = array();

    /**
     * found files
     * @var array
     */
    var $files = array();

    /**
     * found dirs
     * @var array
     */
    var $directories = array();

    /**
     * Search the current directory to find matches for the
     * the specified pattern.
     *
     * @param string $pattern a string containing the pattern to search
     * the directory for.
     *
     * @param string $dirpath a string containing the directory path
     * to search.
     *
     * @param string $pattern_type a string containing the type of
     * pattern matching functions to use (can either be 'php' or
     * 'perl').
     *
     * @return array containing all of the files and directories
     * matching the pattern or null if no matches
     *
     * @author Sterling Hughes <sterling@php.net>
     * @access public
     * @static
     */
    function &glob($pattern, $dirpath, $pattern_type = 'php')
    {
        $dh = @opendir($dirpath);

        if (!$dh) {
            $pe = PEAR::raiseError("Cannot open directory");
            return $pe;
        }

        $match_function = File_Find::_determineRegex($pattern, $pattern_type);
        $matches = array();
        while (false !== ($entry = @readdir($dh))) {
            if ($match_function($pattern, $entry) &&
                $entry != '.' && $entry != '..') {
                $matches[] = $entry;
            }
        }

        @closedir($dh);

        $result = (count($matches) > 0) ? $matches : null;
        return $result;
    }

    /**
     * Map the directory tree given by the directory_path parameter.
     *
     * @param string $directory contains the directory path that you
     * want to map.
     *
     * @return array a two element array, the first element containing a list
     * of all the directories, the second element containing a list of all the
     * files.
     *
     * @author Sterling Hughes <sterling@php.net>
     * @access public
     */
    function &maptree($directory)
    {

        /* if called statically */
        if (!isset($this)  || !is_a($this, "File_Find")) {
            $obj = new File_Find();
            return $obj->maptree($directory);
        }
      
        /* clear the results just in case */
        $this->files       = array();
        $this->directories = array();

        /* consistency rules - strip out trailing slashes */
        $directory = preg_replace('![\\\\/]+$!', '', $directory);
        /* use only native system directory delimiters */
        $directory = preg_replace("![\\\\/]+!", DIRECTORY_SEPARATOR, $directory);

        $this->_dirs = array($directory);

        while (count($this->_dirs)) {
            $dir = array_pop($this->_dirs);
            File_Find::_build($dir);
            array_push($this->directories, $dir);
        }

        return array($this->directories, $this->files);
    }

    /**
     * Map the directory tree given by the directory parameter.
     *
     * @param string $directory contains the directory path that you
     * want to map.
     * @param integer $maxrecursion maximun number of folders to recursive 
     * map
     *
     * @return array a multidimensional array containing all subdirectories
     * and their files. For example:
     *
     * Array
     * (
     *    [0] => file_1.php
     *    [1] => file_2.php
     *    [subdirname] => Array
     *       (
     *          [0] => file_1.php
     *       )
     * )
     *
     * @author Mika Tuupola <tuupola@appelsiini.net>
     * @access public
     * @static
     */
    function &mapTreeMultiple($directory, $maxrecursion = 0, $count = 0)
    {   
        $retval = array();

        $count++;

        $directory .= DIRECTORY_SEPARATOR;
        $dh = opendir($directory);
        while (false !== ($entry = @readdir($dh))) {
            if ($entry != '.' && $entry != '..') {
                 array_push($retval, $entry);
            }
        }

        closedir($dh);
     
        while (list($key, $val) = each($retval)) {
            $path = $directory . $val;
            $path = str_replace(DIRECTORY_SEPARATOR.DIRECTORY_SEPARATOR,
                                DIRECTORY_SEPARATOR, $path);
      
            if (!is_array($val) && is_dir($path)) {
                unset($retval[$key]);
                if ($maxrecursion == 0 || $count < $maxrecursion) {
                    $retval[$val] = &File_Find::mapTreeMultiple($path, 
                                    $maxrecursion, $count);
                }
            }
        }

        return $retval;
    }

    /**
     * Search the specified directory tree with the specified pattern.  Return
     * an array containing all matching files (no directories included).
     *
     * @param string $pattern the pattern to match every file with.
     *
     * @param string $directory the directory tree to search in.
     *
     * @param string $type the type of regular expression support to use, either
     * 'php' or 'perl'.
     *
     * @param bool $fullpath whether the regex should be matched against the
     * full path or only against the filename
     *
     * @param string $match can be either 'files', 'dirs' or 'both' to specify
     * the kind of list to return
     *
     * @return array a list of files matching the pattern parameter in the the
     * directory path specified by the directory parameter
     *
     * @author Sterling Hughes <sterling@php.net>
     * @access public
     * @static
     */
    function &search($pattern, $directory, $type = 'php', $fullpath = true, $match = 'files')
    {

        $matches = array();
        list ($directories,$files)  = File_Find::maptree($directory);
        switch($match) {
            case 'directories': $data = $directories; break;
            case 'both': $data = array_merge($directories, $files); break;
            case 'files':
            default:
                $data = $files;
        }
        unset($files, $directories);

        $match_function = File_Find::_determineRegex($pattern, $type);

        reset($data);
        while (list(,$entry) = each($data)) {
            if ($match_function($pattern, 
                                $fullpath ? $entry : basename($entry))) {
                $matches[] = $entry;
            }
        }

        return ($matches);
    }

    /**
     * Determine whether or not a variable is a PEAR error
     *
     * @param object PEAR_Error $var the variable to test.
     *
     * @return boolean returns true if the variable is a PEAR error, otherwise
     * it returns false.
     * @access public
     */
    function isError(&$var)
    {
        return PEAR::isError($var);
    }

    /**
     * internal function to build singular directory trees, used by
     * File_Find::maptree()
     *
     * @param string $directory name of the directory to read
     * @return void
     */
    function _build($directory)
    {

        $dh = @opendir($directory);

        if (!$dh) {
            $pe = PEAR::raiseError("Cannot open directory");
            return $pe;
        }

        while (false !== ($entry = @readdir($dh))) {
            if ($entry != '.' && $entry != '..') {

                $entry = $directory.DIRECTORY_SEPARATOR.$entry;
                $entry = str_replace(DIRECTORY_SEPARATOR.DIRECTORY_SEPARATOR,
                                     DIRECTORY_SEPARATOR, $entry);

                if (is_dir($entry)) {
                    array_push($this->_dirs, $entry);
                } else {
                    array_push($this->files, $entry);
                }
            }
        }

        @closedir($dh);
    }

    /**
     * internal function to determine the type of regular expression to
     * use, implemented by File_Find::glob() and File_Find::search()
     *
     * @param string $type given RegExp type
     * @return string kind of function ( "eregi", "ereg" or "preg_match") ;
     *
     */
    function _determineRegex($pattern, $type)
    {
        if (!strcasecmp($type, 'shell')) {
            $match_function = 'File_Find_match_shell';
        } else if (!strcasecmp($type, 'perl')) {
            $match_function = 'preg_match';
        } else if (!strcasecmp(substr($pattern, -2), '/i')) {
            $match_function = 'eregi';
        } else {
            $match_function = 'ereg';
        }
        return $match_function;
    }

}

/**
* Package method to match via 'shell' pattern. Provided in global
* scope, because they should be called like 'preg_match' and 'eregi'
* and can be easily copied into other packages
*
* @author techtonik <techtonik@php.net>
* @return mixed bool on success and PEAR_Error on failure
*/ 
function File_Find_match_shell($pattern, $filename)
{
    // {{{ convert pattern to positive and negative regexps
        $positive = $pattern;
        $negation = substr_count($pattern, "|");

        if ($negation > 1) {
            return PEAR::raiseError("Mask string contains errors!");
        } elseif ($negation) {
            list($positive, $negative) = explode("|", $pattern);
            if (strlen($negation) == 0) {
                return PEAR::raiseError("Mask string contains errors!");
            }
        }

       $positive = _File_Find_match_shell_get_pattern($positive);
       if ($negation) {
           $negative = _File_Find_match_shell_get_pattern($negative);
       }
    // }}} convert end 


    if (defined("FILE_FIND_DEBUG")) {
        print("Method: $type\nPattern: $pattern\n Converted pattern:");
        print_r($positive);
        if (isset($negative)) print_r($negative);
    }

    if (!preg_match($positive, $filename)) {
        return FALSE;
    } else {
        if (isset($negative) 
              && preg_match($negative, $filename)) {
            return FALSE;
        } else {
            return TRUE;
        }
    }
}

/**
* function used by File_Find_match_shell to convert 'shell' mask
* into pcre regexp. Some of the rules (see testcases for more): 
*  escaping all special chars and replacing 
*    . with \.
*    * with .*
*    ? with .{1}
*    also adding ^ and $ as the pattern matches whole filename
*
* @author techtonik <techtonik@php.net>
* @return string pcre regexp for preg_match
*/ 
function _File_Find_match_shell_get_pattern($mask) {
    // get array of several masks (if any) delimited by comma
    // do not touch commas in char class
    $premasks = preg_split("|(\[[^\]]+\])|", $mask, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY );
    if (defined("FILE_FIND_DEBUG")) {
        print("\nPremask: ");
        print_r($premasks);
    }
    $pi = 0;
    foreach($premasks as $pm) {
        if (!isset($masks[$pi])) $masks[$pi] = "";
        if ($pm{0} == '[' && $pm{strlen($pm)-1} == ']') {
            // strip commas from character class
            $masks[$pi] .= str_replace(",", "", $pm);
        } else {
            $tarr = explode(",", $pm);
            if (sizeof($tarr) == 1) {
                $masks[$pi] .= $pm;
            } else {
                foreach ($tarr as $te) {
                    $masks[$pi++] .= $te;
                    $masks[$pi] = "";
                }
                unset($masks[$pi--]);
            }
        }
    }

    // convert to preg regexp
    $regexmask = implode("|", $masks);
    if (defined("FILE_FIND_DEBUG")) {
        print("regexMask step one(implode): $regexmask");
    }
    $regexmask = addcslashes($regexmask, '^$}{)(\/.+');
    if (defined("FILE_FIND_DEBUG")) {
        print("\nregexMask step two(addcslashes): $regexmask");
    }
    $regexmask = preg_replace("!(\*|\?)!", ".$1", $regexmask);
    if (defined("FILE_FIND_DEBUG")) {
        print("\nregexMask step three(*,? -> .*,.?): $regexmask");
    }
    // if no extension supplied - add .* to match partially from filename start
    if (strpos($regexmask, "\\.") === FALSE) $regexmask .= ".*";
    // file mask match whole name - adding restrictions
    $regexmask = preg_replace("!(\|)!", '^'."$1".'$', $regexmask);
    $regexmask = '^'.$regexmask.'$';
    if (defined("FILE_FIND_DEBUG")) {
        print("\nregexMask step three(^ and $ to match whole name): $regexmask");
    }
    // wrap regex into + since all + are already escaped
    $regexmask = "+$regexmask+i";
    if (defined("FILE_FIND_DEBUG")) {
        print("\nWrapped regex: $regexmask\n");
    }
    return $regexmask;
}

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * End:
 */

?>
