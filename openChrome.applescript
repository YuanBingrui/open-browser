(*
Copyright (c) 2015-present, Facebook, Inc.
This source code is licensed under the MIT license found in the
LICENSE file at
https://github.com/facebookincubator/create-react-app/blob/master/LICENSE
*)

property targetTab : null
property targetTabIndex : -1
property targetWindow : null
property theProgram : "Google Chrome"

on run argv
  set theURL to item 1 of argv

  -- Allow requested program to be optional,
  -- default to Google Chrome
  if (count of argv) > 1 then
    set theProgram to item 2 of argv
  end if

  using terms from application "Google Chrome"
    tell application theProgram

      if (count every window) = 0 then
        make new window
      end if

      -- 1: Looking for tab running debugger
      -- then, Reload debugging tab if found
      -- then return
      set found to my lookupTabWithUrl(theURL)
      if found then
        set targetWindow's active tab index to targetTabIndex
        tell targetTab to reload
        tell targetWindow to activate
        set index of targetWindow to 1
        return
      end if

      -- 2: Looking for Empty tab
      -- In case debugging tab was not found
      -- We try to find an empty tab instead
      set found to my lookupTabWithUrl("chrome://newtab/")
      if found then
        set targetWindow's active tab index to targetTabIndex
        set URL of targetTab to theURL
        tell targetWindow to activate
        return
      end if

      -- 3: Create new tab
      -- both debugging and empty tab were not found
      -- make a new tab with url
      tell window 1
        activate
        make new tab with properties {URL:theURL}
      end tell
    end tell
  end using terms from
end run

-- Function:
-- Lookup tab with given url
-- if found, store tab, index, and window in properties
-- (properties were declared on top of file)
on lookupTabWithUrl(lookupUrl)
  set domain to getDomain(lookupUrl)
  using terms from application "Google Chrome"
    tell application theProgram
      -- Find a tab with the given url
      set found to false
      set theTabIndex to -1
      repeat with theWindow in every window
        set theTabIndex to 0
        repeat with theTab in every tab of theWindow
          set theTabIndex to theTabIndex + 1
          if (theTab's URL as string) contains domain then
            -- assign tab, tab index, and window to properties
            set targetTab to theTab
            set targetTabIndex to theTabIndex
            set targetWindow to theWindow
            set found to true
            exit repeat
          end if
        end repeat

        if found then
          exit repeat
        end if
      end repeat
    end tell
  end using terms from
  return found
end lookupTabWithUrl

-- Function:
-- get domain with given url
on getDomain(lookupUrl)
  set questionMark to 0
  set backslash to 0
  set endIndex to 1
  set len to length of lookupUrl

  repeat until backslash > 2 or questionMark > 0 or endIndex is equal to len
    set ch to get text endIndex of lookupUrl
    if ch is equal to "/" then
      set backslash to backslash + 1
      if backslash > 2 then
        set endIndex to endIndex - 2
      end if
    else if ch is equal to "?" then
      set questionMark to questionMark + 1
      set endIndex to endIndex - 2
    end if
    set endIndex to endIndex + 1
  end repeat
  return text 1 thru endIndex of lookupUrl
end getDomain
