import UIKit
import Capacitor
import WebKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Dynamic Type bridge: the bundled web UI uses rem units, so scaling the
        // document root font-size from the iOS text-size setting scales the whole
        // app. WKWebView does not honor Dynamic Type natively (Phase 4 finding #3).
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applyDynamicType),
            name: UIContentSizeCategory.didChangeNotification,
            object: nil)
        return true
    }

    // Maps the iOS preferred content size category to a root font-size multiplier
    // ("large" is the iOS default => 1.0). Capped so extreme sizes stay usable.
    private func dynamicTypeMultiplier() -> Double {
        switch UIApplication.shared.preferredContentSizeCategory {
        case .extraSmall: return 0.82
        case .small: return 0.88
        case .medium: return 0.94
        case .large: return 1.0
        case .extraLarge: return 1.12
        case .extraExtraLarge: return 1.24
        case .extraExtraExtraLarge: return 1.36
        case .accessibilityMedium: return 1.52
        case .accessibilityLarge: return 1.68
        case .accessibilityExtraLarge: return 1.84
        case .accessibilityExtraExtraLarge: return 2.0
        case .accessibilityExtraExtraExtraLarge: return 2.15
        default: return 1.0
        }
    }

    @objc func applyDynamicType() {
        guard let vc = window?.rootViewController as? CAPBridgeViewController,
              let webView = vc.webView else { return }
        let m = dynamicTypeMultiplier()
        let js = "(function(){var e=document.documentElement;if(e){e.style.setProperty('font-size',(16*\(m))+'px','important');}})();"
        webView.evaluateJavaScript(js, completionHandler: nil)
    }

    private func scheduleDynamicType() {
        // Re-apply on a few delays so it lands once the bundled DOM is parsed.
        for delay in [0.0, 0.4, 1.2] {
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) { [weak self] in
                self?.applyDynamicType()
            }
        }
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
        // Covers cold launch (after the bundled DOM parses) and return from
        // background (user may have changed Text Size while away).
        scheduleDynamicType()
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
