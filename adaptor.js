/**
 * This adaptor is the public interface for the 3s browser
 * and was 100% written by Reliv.
 * @constructor
 */
function S3ExplorerAdaptor(bucketName, explorerIndexHtmlFilePath) {

    /**
     * name
     * @type {string}
     */
    var name = 'S3Explorer';

    /**
     * getName
     * @returns {string}
     */
    this.getName = function () {
        return name;
    };

    /**
     * Trims the parts off an oldPath that s3explorer doesn't want
     *
     * @param oldPath
     * @returns {string}
     */
    function trimOldPath(oldPath) {
        if (typeof oldPath == 'undefined' || oldPath.length < 1) {
            return '';
        }
        var el = document.createElement('a');
        el.href = oldPath;
        var path = el.pathname.substr(1);
        var filePartPattern = /[^\/]*$/;
        path = path.replace(filePartPattern, '');
        return path
    }

    /**
     * chooseFile
     * @param onFileChosenCallback
     * @param oldPath
     * @param filter
     */
    this.chooseFile = function (onFileChosenCallback, oldPath, filter) {
        var explorerWindow = window.open(
            explorerIndexHtmlFilePath,
            'Choose a File',
            'scrollbars=1,height=600,width=1000'
        );
        explorerWindow.addEventListener(
            'load', function () {
                explorerWindow.s3ExplorerOnFileChosen = function (path) {
                    explorerWindow.close();
                    onFileChosenCallback(path);
                };
                explorerWindow.s3exp_config = {
                    Region: '',
                    Bucket: bucketName,
                    Prefix: trimOldPath(oldPath),
                    Delimiter: '/'
                };
                explorerWindow.s3exp_lister = explorerWindow.s3list(
                    explorerWindow.s3exp_config,
                    explorerWindow.s3draw
                ).go();
                if (window.focus) {
                    explorerWindow.focus()
                }
            },
            true
        );
    }
}
