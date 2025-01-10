import { TreeNode } from "./tree/treedata/TreeData"

let iconExtensionMap: Map<String, string> = new Map()

function transferJson2Map(json: { [key: string]: string }): Map<String, string> {
    return new Map(Object.entries(json))
}

const iconMap = {
    "ts": "file_type_typescript.svg",
    "js": "file_type_javascript.svg",
    "jsx": "file_type_reactjs.svg",
    "tsx": "file_type_reactts.svg",
    "json": "file_type_json.svg",
    "java": "file_type_java.svg",
    "class": "file_type_java.svg",
    "jar": "file_type_jar.svg",
    "php": "file_type_php.svg",
    "py": "file_type_python.svg",
    "pyc": "file_type_python.svg",
    "swift": "file_type_swift.svg",
    "cpp": "file_type_cpp.svg",
    "c": "file_type_c.svg",
    "h": "file_type_header.svg",
    "hpp": "file_type_header.svg",
    "cs": "file_type_csharp.svg",
    "go": "file_type_go.svg",
    "rb": "file_type_ruby.svg",
    "rs": "file_type_rust.svg",
    "scala": "file_type_scala.svg",
    "kt": "file_type_kotlin.svg",
    "dart": "file_type_dart.svg",
    "lua": "file_type_lua.svg",
    "pl": "file_type_perl.svg",
    "r": "file_type_r.svg",

    "html": "file_type_html.svg",
    "htm": "file_type_html.svg",
    "css": "file_type_css.svg",
    "scss": "file_type_sass.svg",
    "sass": "file_type_sass.svg",
    "less": "file_type_less.svg",
    "vue": "file_type_vue.svg",
    "svelte": "file_type_svelte.svg",

    "md": "file_type_markdown.svg",
    "markdown": "file_type_markdown.svg",
    "xml": "file_type_xml.svg",
    "yaml": "file_type_yaml.svg",
    "yml": "file_type_yaml.svg",
    "toml": "file_type_toml.svg",

    "svg": "file_type_svg.svg",
    "png": "file_type_image.svg",
    "jpg": "file_type_image.svg",
    "jpeg": "file_type_image.svg",
    "gif": "file_type_image.svg",
    "ico": "file_type_image.svg",
    "webp": "file_type_image.svg",

    "mp3": "file_type_audio.svg",
    "wav": "file_type_audio.svg",
    "ogg": "file_type_audio.svg",
    "mp4": "file_type_video.svg",
    "avi": "file_type_video.svg",
    "mov": "file_type_video.svg",
    "wmv": "file_type_video.svg",

    "pdf": "file_type_pdf.svg",
    "doc": "file_type_word.svg",
    "docx": "file_type_word.svg",
    "xls": "file_type_excel.svg",
    "xlsx": "file_type_excel.svg",
    "ppt": "file_type_powerpoint.svg",
    "pptx": "file_type_powerpoint.svg",
    "txt": "file_type_text.svg",
    "rtf": "file_type_text.svg",

    "zip": "file_type_zip.svg",
    "rar": "file_type_rar.svg",
    "7z": "file_type_archive.svg",
    "tar": "file_type_archive.svg",
    "gz": "file_type_archive.svg",

    "exe": "file_type_exe.svg",
    "dll": "file_type_dll.svg",
    "app": "file_type_app.svg",
    "dmg": "file_type_dmg.svg",
    "apk": "file_type_android.svg",
    "ipa": "file_type_ios.svg",

    "config": "file_type_config.svg",
    "conf": "file_type_config.svg",
    "ini": "file_type_config.svg",
    "env": "file_type_env.svg",

    "ttf": "file_type_font.svg",
    "otf": "file_type_font.svg",
    "woff": "file_type_font.svg",
    "woff2": "file_type_font.svg",

    "sql": "file_type_sql.svg",
    "db": "file_type_database.svg",
    "sqlite": "file_type_sqlite.svg",

    "bat": "file_type_bat.svg",
    "sh": "file_type_shell.svg",
    "cmake": "file_type_cmake.svg",
    "make": "file_type_makefile.svg",
    "gradle": "file_type_gradle.svg",
    "gitignore": "file_type_git.svg",
    "dockerignore": "file_type_docker.svg",
    "dockerfile": "file_type_docker.svg",
    "license": "file_type_license.svg",
    "cert": "file_type_certificate.svg",
    "key": "file_type_key.svg"
}

iconExtensionMap = transferJson2Map(iconMap)

const iconFolderPath = "../assets/icons/"

export function getIconPath(treeNode: TreeNode): string {
    if (treeNode.isDirectory) {
        return iconFolderPath + "default_folder.svg"
    }

    let ext = treeNode.label.substring(treeNode.label.lastIndexOf(".") + 1)
    let filePath = iconExtensionMap.get(ext) 
    if (filePath) {
        return iconFolderPath + filePath
    } else {
        return iconFolderPath + "default_file.svg"
    }
}
