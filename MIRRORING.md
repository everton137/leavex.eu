# GitHub-GitLab Repository Mirroring Guide

This guide explains how to check if repository mirroring is activated between GitHub and GitLab, and how to verify that it's working correctly.

## Understanding Repository Mirroring

Repository mirroring keeps two repositories synchronized. In this setup:
- **Source Repository**: The primary repository where changes are made (typically GitLab)
- **Mirror Repository**: The secondary repository that receives updates (typically GitHub)

## Checking if Mirroring is Activated on GitLab (Source)

If GitLab is the source repository that mirrors to GitHub:

### 1. Access Repository Settings
1. Navigate to your GitLab repository
2. Go to **Settings** → **Repository**
3. Expand the **Mirroring repositories** section

### 2. Verify Mirror Configuration
Look for an entry with:
- **Git repository URL**: Should contain your GitHub repository URL
- **Mirror direction**: Should be set to **Push**
- **Authentication method**: Usually SSH or password-based
- **Status**: Should show a green checkmark or "Successfully updated"

### 3. Check Mirror Status
- **Last successful update**: Shows the timestamp of the last sync
- **Last error**: If present, shows any synchronization issues
- **Update now**: Button to manually trigger a mirror update

## Checking if Mirroring is Activated on GitHub (Mirror)

If GitHub is receiving mirrors from GitLab:

### 1. Check Repository Settings
1. Go to your GitHub repository
2. Navigate to **Settings** → **Code and automation** section
3. Look for any webhook configurations pointing to GitLab

### 2. Verify Push Events
1. Go to **Settings** → **Webhooks**
2. Check if there's a webhook from GitLab
3. Click on the webhook to see recent deliveries and their status

### 3. Check Repository Activity
1. Go to the **Insights** tab
2. Click on **Network** to see the commit graph
3. Verify that commits are coming from the mirrored repository

## Verifying Mirror is Working

### Method 1: Check Commit History
```bash
# Clone both repositories
git clone <gitlab-repo-url> gitlab-repo
git clone <github-repo-url> github-repo

# Compare the latest commits
cd gitlab-repo
git log --oneline -5

cd ../github-repo
git log --oneline -5
```

Both repositories should show the same recent commits.

### Method 2: Check Remote Configuration
```bash
# In your local repository
git remote -v

# Check if multiple remotes are configured
git remote show origin
```

### Method 3: Test the Mirror
1. Make a small change in the source repository (GitLab)
2. Commit and push the change
3. Wait a few minutes
4. Check if the change appears in the mirror repository (GitHub)

## Common Mirror Configurations

### GitLab → GitHub (Push Mirror)
- GitLab pushes changes to GitHub automatically
- Configured in GitLab's repository settings
- Requires GitHub access token or SSH key

### GitHub → GitLab (Pull Mirror)
- GitLab pulls changes from GitHub periodically
- Configured in GitLab's repository settings
- Requires GitHub repository access

## Troubleshooting

### Mirror is Not Updating

1. **Check Authentication**
   - Verify that the access token or SSH key is still valid
   - Ensure the token has the necessary permissions (write access for push mirrors)

2. **Check Mirror Status**
   - Look for error messages in the mirror settings
   - Common errors:
     - Authentication failed
     - Repository not found
     - Permission denied

3. **Manual Sync**
   - Try clicking "Update now" in GitLab's mirror settings
   - Check the error log for detailed information

4. **Verify Network Connectivity**
   - Ensure GitLab can reach GitHub (no firewall issues)
   - Check if the repository URL is correct

### Mirror Shows Errors

1. **Authentication Errors**
   - Regenerate the access token
   - Update the token in mirror settings
   - For SSH: verify the SSH key is added to GitHub

2. **Protected Branches**
   - Check if the target branch is protected on GitHub
   - Adjust protection rules if necessary

3. **Large File Issues**
   - Verify there are no files exceeding GitHub's size limits
   - Check Git LFS configuration if using large files

## Best Practices

1. **Regular Monitoring**: Check mirror status periodically to ensure synchronization
2. **Error Notifications**: Set up email notifications for mirror failures (if available)
3. **Backup Strategy**: Don't rely solely on mirroring for backups
4. **Documentation**: Keep track of which repository is the source of truth
5. **Access Control**: Ensure proper permissions are set on both repositories

## Additional Resources

- [GitLab Repository Mirroring Documentation](https://docs.gitlab.com/ee/user/project/repository/mirror/)
- [GitHub API for Repository Information](https://docs.github.com/en/rest/repos/repos)
- [Git Remote Documentation](https://git-scm.com/docs/git-remote)

## Quick Checklist

Use this checklist to verify your mirror is set up correctly:

- [ ] Mirror configuration exists in GitLab settings
- [ ] Authentication credentials are valid and up-to-date
- [ ] Last successful update timestamp is recent
- [ ] No error messages in mirror status
- [ ] Test commit successfully propagated from source to mirror
- [ ] Commit history matches between repositories
- [ ] Webhooks (if used) are showing successful deliveries
