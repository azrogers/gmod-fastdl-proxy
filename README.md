# gmod-fastdl-proxy

A set of tools for uploading and hosting FastDL content for a Garry's Mod server on an S3-compatible host. This is under an MIT license why not

## fastdl-upload

Searches through your Garry's Mod directory (specified in gameDir in config.json) and uploads all FastDL-able files to the S3 bucket specified. Automatically bzips any files over 50kb. Produces a cache.json file containing checksums of all uploaded files so it won't try to upload them again unless they've changed. Also produces a resource.lua file containing `resource.AddFile` lines for all relevant files it found.

## fastdl-proxy

Points to the S3 bucket with files uploaded from `fastdl-upload` and serves the files in a basic HTTP server that `sv_downloadurl` can access.